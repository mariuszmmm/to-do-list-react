import { List, Item, Button, Content, Text } from "./styled";

const Tasks = ({ tasks, hideDone, removeTasks, toggleTaskDone }) => (
	<List>
		{tasks.map(task => (
			<Item
				key={task.id}
				hidden={task.done && hideDone}
			>
				<Button
					toggleDone
					onClick={() => toggleTaskDone(task.id)}
				>
					{task.done ? "✔" : ""}
				</Button>
				<Content>
					{task.id}.{" "}
					<Text done={task.done}>
						&nbsp;{task.content}&nbsp;
					</Text>
				</Content>
				<Button
					remove
					onClick={() => removeTasks(task.id)}
				>
					🗑︎
				</Button>
			</Item>
		))}
	</List>
);

export default Tasks;