import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter();
  constructor(private accountService:AccountService ) { }

  ngOnInit(): void {
  }
  register() {
    this.accountService.register(this.model).subscribe(res => {
      console.log(res);
      this.cancel();
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}