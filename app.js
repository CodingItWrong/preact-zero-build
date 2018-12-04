'use strict';

const { h, render, Component } = window.preact;
const { createStore, Provider, connect } = window.unistore;
const htm = window.htm;

const html = htm.bind(h);

const store = createStore({ todos: [] });
const actions = store => ({
	loadTodos: () => {
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then(response => response.json())
			.then(todos => store.setState({ todos }))
			.catch(console.error);
	}
});

const ConnectedTodoContainer = connect('todos', actions)(
	({ todos, loadTodos }) => (
		h(TodoContainer, { todos, loadTodos })
	)
);

class TodoContainer extends Component {
	componentDidMount() {
		this.props.loadTodos();
	}

	render() {
		const { todos } = this.props;
		return html`
			<div>
				<h1>Todos</h1>

				<${TodoList} todos=${todos} />
			</div>
		`;
	}
}

const TodoList = ({ todos }) => html`
	<ul>
		${todos.map(todo => html`
			<li>${todo.title}</li>
		`)}
	</ul>
`;

render((
	h(Provider, { store },
		h(ConnectedTodoContainer)
	)
), document.body);
