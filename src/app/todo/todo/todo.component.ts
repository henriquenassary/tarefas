import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../todo-model';
import { TodoService } from 'src/app/todo.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  form: FormGroup;
  datepipe: DatePipe = new DatePipe('en-US');
  dateTask: any;
  validated: boolean = true;

  todos: Todo[] = []

  headers: string[] = [ 'description', 'dateTask', 'doneDate', 'açoes', 'iconDone'];
  dataSource = this.todos;
  constructor(private service: TodoService, private _formbuilder: FormBuilder){

  }

  ngOnInit() {
    this.form = this._formbuilder.group({
      description : ['', Validators.required],
      dateTask: [this.dateTask]
    })
    this.listarTodos()
  }

  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<any>) {
    this.events.push(`${type}: ${event.value}`);
    this.dateTask = this.datepipe.transform(event.value, 'dd/MM/yyyy');
  }

  listarTodos(){
    this.service.listar().subscribe(todoList => this.todos = todoList)
  }

  submit(){
    const todo: Todo = { ...this.form.value }
    this.service
      .salvar(todo)
      .subscribe(savedTodo => {
        this.todos.push(savedTodo)
        this.form.reset()
        this.listarTodos();
      })
  }

  delete(todo: Todo) {
    this.service.deletar(todo.id).subscribe({
      next: (response) => this.listarTodos()
    })
  }

  done(todo: Todo) {
    this.service.marcarComoConcluido(todo.id).subscribe({
      next: (todoAtualizado) => {
        todo.done = todoAtualizado.done
        todo.doneDate = todoAtualizado.doneDate
      }
    })
  }

}
