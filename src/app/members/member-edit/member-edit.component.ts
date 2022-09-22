import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/members';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_Services/account.service';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm;
  member:Member;
  user:User;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService:AccountService, private memberService:MembersService, private toastr:ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      data => this.user = data
    );
   }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(
      data => {
        this.member = data;
      }
    )
  }

  updateMember(){
    console.log(this.member);
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success("Profile Updated Sucessfully");
      this.editForm.reset(this.member);
    });
  }


}
