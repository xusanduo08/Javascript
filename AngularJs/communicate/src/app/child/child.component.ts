import { Component, OnInit,Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {

  userName: string = "";

  @Input() placeholder: string = "What's your name";

  @Output() vertificate = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  emitEvent(){
    this.vertificate.emit(this.userName)
  }

  doLogin(value) {
    console.log(value);
  }
}
