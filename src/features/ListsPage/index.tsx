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
  setLists,
} from "./listsSlice";
import { useEffect } from "react";
import { getUserToken } from "../../utils/getUserToken";
import { setVersion } from "../AccountPage/accountSlice";
import { getDataApi } from "../../api/fetchDataApi";

const ListsPage = () => {
  const areListsEmpty = useAppSelector(selectAreListsEmpty);
  const selectedListId = useAppSelector(selectSelectedListId);
  const selectedListById = useAppSelector((state) =>
    selectedListId ? selectSelectedListById(state, selectedListId) : null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const refreshData = async () => {
        const token = await getUserToken();
        if (!token) {
          console.error("No token found");
          return;
        }

        const data = await getDataApi(token);
        if (!data || !data.lists || !data.version) {
          console.error("No data");
          return;
        }

        setLists(data.lists);
        setVersion(data.version);
        console.log("Data refreshed"); // usunąć
      };

      refreshData();
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Header title="Zapisane listy" />
      <Section
        title={areListsEmpty ? "Nie masz zapisanych list 😯" : "Wybierz listę"}
        body={<ListsList />}
        extraHeaderContent={<ListsButtons />}
      />
      {selectedListById !== null && (
        <>
          <Header title="Wybrana lista" />
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
