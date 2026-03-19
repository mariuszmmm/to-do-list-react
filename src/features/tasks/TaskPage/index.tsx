import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux/redux";
import { DateInfo, Name } from "./styled";
import { Button } from "../../../common/Button";
import { Header } from "../../../common/Header";
import { Section } from "../../../common/Section";
import { selectTaskById } from "../tasksSlice";
import { formatCurrentDate } from "../../../utils/formatting/formatCurrentDate";
import { useTranslation } from "react-i18next";
import { FormButton } from "../../../common/FormButton";
import { FormButtonWrapper } from "../../../common/FormButtonWrapper";
import {
  Image,
  ImagePreview,
  ImagePreviewWrapper,
} from "../../../common/Image";
import { ImageModal } from "../../../common/ImageModal";

const TaskPage = () => {
  const { id: taskId } = useParams();
  const navigate = useNavigate();
  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "taskPage",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { imageUrl } = task?.image || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const taskContent = task ? task.content : t("noContent");
  const isTruncated = taskContent.length > 300;
  const displayedContent =
    isTruncated && !isExpanded
      ? taskContent.slice(0, 300) + "..."
      : taskContent;

  return (
    <>
      <Header title={t("title")} />
      <Section
        taskDetails
        title={
          <span>
            {displayedContent}
            {isTruncated && (
              <>
                <Button $special onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? ` ${t("showLess")}` : ` ${t("showMore")}`}
                </Button>
              </>
            )}
          </span>
        }
        body={
          task && (
            <>
              {task.image && imageUrl && (
                <>
                  <ImagePreviewWrapper>
                    <ImagePreview
                      onClick={() => setIsModalOpen(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <Image src={imageUrl} alt="preview" key={imageUrl} />
                    </ImagePreview>
                  </ImagePreviewWrapper>
                  {isModalOpen && (
                    <ImageModal
                      src={imageUrl}
                      alt={task.content}
                      onClose={() => setIsModalOpen(false)}
                    />
                  )}
                </>
              )}
              <DateInfo>
                <Name>{t("done.title")}:</Name>
                {task.done ? t("done.yes") : t("done.no")}
              </DateInfo>
              <DateInfo>
                <Name>{t("dateCreated")}:</Name>
                {formatCurrentDate(new Date(task.date), i18n.language)}
              </DateInfo>
              {task.editedAt && task.editedAt !== task.date && (
                <DateInfo>
                  <Name>{t("dateEdited")}:</Name>
                  {formatCurrentDate(new Date(task.editedAt), i18n.language)}
                </DateInfo>
              )}
              {task.done && task.completedAt && (
                <DateInfo>
                  <Name>{t("dateDone")}:</Name>
                  {formatCurrentDate(new Date(task.completedAt), i18n.language)}
                </DateInfo>
              )}

              <FormButtonWrapper $taskDetails>
                <FormButton
                  type="button"
                  width={"200px"}
                  onClick={() => navigate(-1)}
                  $singleInput
                  $cancel
                >
                  {t("backButton")}
                </FormButton>
              </FormButtonWrapper>
            </>
          )
        }
      />
    </>
  );
};

export default TaskPage;
