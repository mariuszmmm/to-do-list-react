import { useAppSelector } from "../../hooks";
import { ListsList } from "./ListsList";
import { ListsButtons } from "./ListsButtons";
import { TasksList } from "./TasksList";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import {
  selectAreListsEmpty,
  selectSelectedListId,
  selectSelectedListById,
} from "./listsSlice";
import { useTranslation } from "react-i18next";

const ListsPage = () => {
  const areListsEmpty = useAppSelector(selectAreListsEmpty);
  const selectedListId = useAppSelector(selectSelectedListId);
  const selectedListById = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );
  const { t } = useTranslation("translation", {
    keyPrefix: "listsPage",
  });

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={areListsEmpty ? t("lists.empty") : t("lists.select")}
        body={<ListsList />}
        extraHeaderContent={<ListsButtons />}
      />
      {selectedListById !== null && (
        <>
          <Header title={t("subTitle")} sub />
          <Section
            title={selectedListById.name}
            body={<TasksList list={selectedListById.taskList} />}
          />
        </>
      )}
    </>
  );
};

export default ListsPage;
