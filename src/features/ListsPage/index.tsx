import { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import { useTranslation } from "react-i18next";
import { ListsData } from "../../types";
import { ListsList } from "./ListsList";
import { ListsButtons } from "./ListsButtons";
import { TasksList } from "./TasksList";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { selectSelectedListId, selectIsListsSorting } from "./listsSlice";

type Props = { listsData: ListsData };

const ListsPage = ({ listsData }: Props) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "listsPage",
  });

  const selectedListId = useAppSelector(selectSelectedListId);
  const isListsSorting = useAppSelector(selectIsListsSorting);
  const areListsEmpty = !listsData || listsData.lists.length === 0;
  const selectedListById =
    listsData?.lists.find(({ id }) => id === selectedListId) || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title={areListsEmpty ? t("lists.empty") : t("lists.select")}
        body={<ListsList listsData={listsData} />}
        extraHeaderContent={
          <ListsButtons
            listsData={listsData}
            selectedListById={selectedListById}
          />
        }
      />
      {selectedListById && !isListsSorting && (
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
