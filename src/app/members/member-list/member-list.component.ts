import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs'
import { Member } from 'src/app/_models/members';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/User';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_Services/account.service';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members:Member[];
  pagination:Pagination;
  userParams:UserParams;
  user:User;
  genderList =[{value:'male',display:'Males'},{value:'female',display:'Females'}];
  constructor(private memberService:MembersService,private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
   }

  ngOnInit(): void {
    this.loadMembers()
  }

  loadMembers(){
    this.memberService.getMembers(this.userParams).subscribe(res=>{
      this.members = res.results;
      this.pagination = res.pagination;
    })
  }

  resetFilters(){
    this.userParams = new UserParams(this.user);
    this.loadMembers();
  }
  pageChanged(event:any){
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }
  
  }
