'use strict';

(() => {
  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const createElementWithAttributes = (tag, attributes = {}, ...children) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value;
    });
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  };

  const updateTodos = (updatedTodos) => {
    todos = updatedTodos;
    saveTodos();
    renderTodos();
  };

  const renderTodo = (todo) => {
    const input = createElementWithAttributes('input', {
      type: 'checkbox',
      checked: todo.isCompleted,
    });
    input.addEventListener('change', () => {
      updateTodos(
        todos.map((item) =>
          item.id === todo.id
            ? { ...item, isCompleted: !item.isCompleted }
            : item
        )
      );
    });

    const span = createElementWithAttributes('span', {}, todo.title);

    const label = createElementWithAttributes('label', {}, input, span);

    const button = createElementWithAttributes('button', {}, 'x');
    button.addEventListener('click', () => {
      if (!confirm('Delete?')) return;
      updateTodos(todos.filter((item) => item.id !== todo.id));
    });

    const li = createElementWithAttributes('li', {}, label, button);
    document.querySelector('#todos').appendChild(li);
  };

  const renderTodos = () => {
    const todosList = document.querySelector('#todos');
    todosList.innerHTML = '';
    todos.forEach(renderTodo);
  };

  document.querySelector('#add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#add-form input');
    const newTodo = {
      id: Date.now(),
      title: input.value.trim(),
      isCompleted: false,
    };
    if (!newTodo.title) return;
    todos.push(newTodo);
    saveTodos();
    renderTodo(newTodo);
    input.value = '';
    input.focus();
  });

  document.querySelector('#purge').addEventListener('click', () => {
    if (!confirm('Sure?')) return;
    updateTodos(todos.filter((todo) => !todo.isCompleted));
  });

  renderTodos();
})();
