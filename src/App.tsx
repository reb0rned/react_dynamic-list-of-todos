/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [chosenTodo, setChosenTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.all);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(todosData => setTodos(todosData))
      .finally(() => setLoading(false));
  }, []);

  const todosFiltering = (filterByValue: FilterBy, queryInputValue: string) => {
    let filteredTodos = todos;

    if (filterByValue === FilterBy.active) {
      filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (filterByValue === FilterBy.completed) {
      filteredTodos = todos.filter(todo => todo.completed);
    }

    if (queryInputValue) {
      return filteredTodos.filter(todo => {
        const loweredQuery = queryInputValue.toLowerCase();
        const loweredTitle = todo.title.toLowerCase();

        return loweredTitle.includes(loweredQuery);
      });
    }

    return filteredTodos;
  };

  const todosForView = todosFiltering(filterBy, query);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                setFilterBy={setFilterBy}
                setQuery={setQuery}
                query={query}
              />
            </div>

            <div className="block">
              {loading && !todos.length && <Loader />}
              <TodoList
                todos={todosForView}
                chosenTodo={chosenTodo}
                setChosenTodo={setChosenTodo}
              />
            </div>
          </div>
        </div>
      </div>

      {chosenTodo && (
        <TodoModal
          setLoading={setLoading}
          loading={loading}
          setChosenTodo={setChosenTodo}
          chosenTodo={chosenTodo}
        />
      )}
    </>
  );
};
