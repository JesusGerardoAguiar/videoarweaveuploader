import { useState, useContext, useEffect } from "react";
import { MainContext } from "../context";
import { APP_NAME, tagSelectOptions } from "../utils";
import { useRouter } from "next/router";
import { css } from "@emotion/css";
import { utils } from "ethers";
import Select from "react-select";
import Funds from "../components/Funds";
import sizeof from "object-sizeof";
const supportedCurrencies = {
  matic: "matic",
  //   ethereum: 'ethereum',
  //   avalanche: 'avalanche',
  //   bnb: 'bnb',
  //   arbitrum: 'arbitrum'
};

const currencyOptions = Object.keys(supportedCurrencies).map((v) => {
  return {
    value: v,
    label: v,
  };
});

export default function Profile() {
  const { bundlrInstance, initialiseBundlr, currency, setCurrency } =
    useContext(MainContext);
  const [file, setFile] = useState();
  const [localVideo, setLocalVideo] = useState();
  const [title, setTitle] = useState("");
  const [fileCost, setFileCost] = useState();
  const [fileSize, setFileSize] = useState(0);
  const [description, setDescription] = useState("");
  const [tagSelectState, setTagSelectState] = useState();
  const router = useRouter();

  const [URI, setURI] = useState();

  function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileSize(file.size);
    if (file) {
      const video = URL.createObjectURL(file);
      setLocalVideo(video);
      let reader = new FileReader();
      reader.onload = function (e) {
        if (reader.result) {
          setFile(Buffer.from(reader.result));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  useEffect(() => {
    const size = sizeof({ title, description });
    checkUploadCost(size + fileSize < 0 ? 0 : size + fileSize);
  }, [file, title, description]);

  async function checkUploadCost(bytes) {
    if (bytes && bundlrInstance) {
      const cost = await bundlrInstance.getPrice(bytes);
      const formattedCost = utils.formatEther(cost.toString());
      setFileCost(formattedCost);
    }
  }

  async function uploadFile() {
    if (!file) return;
    const tags = [{ name: "Content-Type", value: "video/mp4" }];
    try {
      let tx = await bundlrInstance.uploader.upload(file, tags);
      setURI(`http://arweave.net/${tx.data.id}`);
    } catch (err) {
      console.log("Error uploading video: ", err);
    }
  }

  async function saveVideo() {
    if (!file || !title || !description) return;
    const tags = [
      { name: "Content-Type", value: "text/plain" },
      { name: "App-Name", value: APP_NAME },
    ];
    const videoTags = [{ name: "Content-Type", value: "video/mp4" }];
    try {
      let txVideo = await bundlrInstance.uploader.upload(file, videoTags);
      const uri = `http://arweave.net/${txVideo.data.id}`;
      const video = {
        title,
        description,
        uri,
        createdAt: new Date(),
        createdBy: bundlrInstance.address,
      };
      try {
        let tx = await bundlrInstance.createTransaction(JSON.stringify(video), {
          tags,
        });
        await tx.sign();
        const { data } = await tx.upload();

        setURI(`http://arweave.net/${data.id}`);
      } catch (err) {
        console.log("error uploading video with metadata: ", err);
      }
    } catch (err) {
      console.log("Error uploading video: ", err);
    }
  }

  if (!bundlrInstance) {
    return (
      <div>
        <div className={selectContainerStyle}>
          <Select
            onChange={({ value }) => setCurrency(value)}
            options={currencyOptions}
            defaultValue={{ value: currency, label: currency }}
            classNamePrefix="select"
            instanceId="currency"
          />
          <p>Currency: {currency}</p>
        </div>
        <div className={containerStyle}>
          <button className={wideButtonStyle} onClick={initialiseBundlr}>
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyle} style={{ justifyContent: "space-evenly" }}>
      <div className={formStyle}>
        <p className={labelStyle}>Add Video</p>
        <div className={inputContainerStyle}>
          <input type="file" onChange={onFileChange} />
        </div>
        <p className={labelStyle}>Title</p>
        <input
          className={inputStyle}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Class title"
        />
        <p className={labelStyle}>Description</p>
        <textarea
          placeholder="Class description"
          onChange={(e) => setDescription(e.target.value)}
          className={textAreaStyle}
        />
        {localVideo && (
          <video key={localVideo} width="520" controls className={videoStyle}>
            <source src={localVideo} type="video/mp4" />
          </video>
        )}
        {fileCost && (
          <h4>Cost to upload: {Math.round(fileCost * 1000) / 1000} MATIC</h4>
        )}
        <button className={saveVideoButtonStyle} onClick={saveVideo}>
          Save Class to arweave
        </button>
        {URI && (
          <div>
            <p className={linkStyle}>
              <a href={URI}>{URI}</a>
            </p>
          </div>
        )}
        {/* <button className={buttonStyle} onClick={uploadFile}>
          Upload Video
        </button> */}
        {/* {URI && (
          <div>
            <p className={linkStyle}>
              <a href={URI}>{URI}</a>
            </p>
            <div className={formStyle}>
              <p className={labelStyle}>Tag (optional)</p>
              <Select
                options={tagSelectOptions}
                className={selectStyle}
                onChange={(data) => setTagSelectState(data)}
                isClearable
              />
              <button className={saveVideoButtonStyle} onClick={saveVideo}>
                Save Video
              </button>
            </div>
          </div> */}
        {/* )} */}
      </div>
      <Funds />
    </div>
  );
}
const primaryColor="#E75B4E";
const secondaryColor="#FFDFD1";

const selectStyle = css`
  margin-bottom: 20px;
  min-width: 400px;
  border-color: red;
`;

const selectContainerStyle = css`
  margin: 10px 0px 20px;
`;

const linkStyle = css`
  margin: 15px 0px;
`;

const containerStyle = css`
  padding: 10px 20px;
  display: flex;
  justify-content: center;
`;

const inputContainerStyle = css`
  margin: 0px 0px 15px;
`;

const videoStyle = css`
  margin-bottom: 20px;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0px 0px;
`;

const labelStyle = css`
  margin: 0px 0px 5px;
`;

const inputStyle = css`
  padding: 12px 20px;
  
  border: none;
  outline: none;
  background-color: rgba(0, 0, 0, 0.08);
  margin-bottom: 15px;
`;

const textAreaStyle = css`
  ${inputStyle};
  width: 350px;
  height: 90px;
`;

const buttonStyle = css`
  background-color: ${primaryColor};
  color: white;
  padding: 12px 40px;
  border:none;
  font-weight: 700;
  width: 180;
  transition: all 0.35s;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.75);
  }
`;

const saveVideoButtonStyle = css`
  ${buttonStyle};
  margin-top: 15px;
`;

const wideButtonStyle = css`
  ${buttonStyle};
  width: 380px;
`;
