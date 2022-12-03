import React from "react";
import "./style.css";

const Buttons = ({ tasks, hideDoneTasks }) => (
	tasks.length > 0 && (
		<span>
			<button className="header__button">
				{hideDoneTasks ? "Pokaż" : "Ukryj"} ukończone
			</button>
			<button className="header__button"
				disabled={tasks.every(({ done }) => done)}
			>
				Ukończ wszystkie
			</button>
		</span>
	)
);

export default Buttons;