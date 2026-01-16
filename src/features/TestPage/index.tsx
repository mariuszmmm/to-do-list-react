import { useCallback, useRef, useState } from "react";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { FormButton } from "../../common/FormButton";
import { FormButtonWrapper } from "../../common/FormButtonWrapper";
import styled from "styled-components";
import { ReactComponent as PlaceholderIcon } from "../../images/imagePlaceholder.svg";

type UploadResult = {
  secure_url?: string;
  url?: string;
  error?: unknown;
};

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "";

// Rezerwa na przyszłe użycie elementów z TaskPage (obecnie nieużywane)

const ErrorMessage = styled.p`
  color: crimson;
  margin: 12px 0;
`;

const UploadingMessage = styled.p`
  color: #666;
  margin: 12px 0;
`;

const ImagePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 4px;
  background-color: darkgray;

  img {
    width: 100%;
    max-width: 600px;
    height: auto;
    border-radius: 4px;
    margin-bottom: 12px;
    animation: fadeIn 0.3s ease-in;
  }

  svg {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const MessageContainer = styled.div`
  min-height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
`;

export const TestPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = useCallback(
    async (file: File): Promise<UploadResult> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        const json = (await res.json()) as UploadResult;
        return json;
      } catch (error) {
        return { error };
      }
    },
    []
  );

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setErrorMsg(null);
      setIsUploading(true);

      try {
        const result = await uploadToCloudinary(files[0]);
        const url = result.secure_url || result.url;
        if (url) {
          setIsImageLoaded(false);
          setImage(url);
        } else {
          setErrorMsg("Nie udało się wgrać zdjęcia.");
        }
      } catch (err) {
        setErrorMsg("Wystąpił błąd podczas wgrywania.");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [uploadToCloudinary]
  );

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
    setDisplayImage(image);
  }, [image]);

  return (
    <>
      <Header title="Cloudinary Upload Test" />
      <Section
        title="Wgraj zdjęcie do Cloudinary"
        body={
          <>
            <ImagePreview>
              {image && isImageLoaded ? (
                <img src={image} alt="preview" key={image} />
              ) : image && !isImageLoaded ? (
                <>
                  <img src={image} alt="preview" onLoad={handleImageLoad} style={{ display: 'none' }} />
                  {displayImage ? <img src={displayImage} alt="current" key={displayImage} /> : <PlaceholderIcon key="placeholder" />}
                </>
              ) : (
                <PlaceholderIcon key="placeholder" />
              )}
            </ImagePreview>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              disabled={isUploading}
              style={{ display: 'none' }}
            />

            <MessageContainer>
              {(isUploading || (image && !isImageLoaded)) && <UploadingMessage>Wgrywanie…</UploadingMessage>}
              {errorMsg && <ErrorMessage>Błąd: {errorMsg}</ErrorMessage>}
            </MessageContainer>

            <FormButtonWrapper $taskDetails>
              <FormButton
                type="button"
                width="200px"
                onClick={() => fileInputRef.current?.click()}
                disabled={(isUploading || (!!image && !isImageLoaded))}
                $singleInput
              >
                {image ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
              </FormButton>
              {image && (
                <FormButton
                  type="button"
                  width="200px"
                  onClick={() => {
                    setImage(null);
                    setDisplayImage(null);
                  }}
                  disabled={(isUploading || (!isImageLoaded))}
                  $singleInput
                >
                  Usuń
                </FormButton>
              )}
            </FormButtonWrapper>
          </>
        }
      />
    </>
  );
}