import "./style.css";

const Tasks = ({ tasks, hideDone, removeTasks, toggleTaskDone }) => (
	<ul className="tasks">
		{tasks.map(task => (
			<li
				key={task.id}
				className={`tasks__item ${(task.done && hideDone) ? "task__item--hide" : ""}`}
			>
				<button
					className="tasks__button tasks__button--toggleDone"
					onClick={() => toggleTaskDone(task.id)}
				>
					{task.done ? "✔" : ""}
				</button>
				<p className="tasks__content">
					{task.id}.{" "}
					<span className={`tasks__content ${task.done ? "tasks__content--toggleDone" : ""}`}>
					&nbsp;{task.content}&nbsp;
					</span>
					</p>
				<button
					className="tasks__button tasks__button--remove"
					onClick={() => removeTasks(task.id)}
				>
					🗑︎
				</button>
			</li>
		))}
	</ul >
);

export default Tasks;