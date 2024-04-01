import { Component } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { ModalDialogComponent } from '../../modal-dialog/modal-dialog.component';


@Component({
  selector: 'app-account-administration',
  templateUrl: './account-administration.component.html',
  styleUrl: './account-administration.component.scss'
})
export class AccountAdministrationComponent {

  dataString:any;
  searchInput: string = "";
  proposalIntakeForm!: any;
  usersAccountForm!:any;
  filterUsers!:any;
  currentDate: Date = new Date();

  auditTrailForm!:any;
  userId: string = "";
  role_name: string = "";

  proposalIntakes!:any;
  proposalDocuments!:any;
  implementationDocuments!:any;

  user_fullname: string = "";
  user_fname: string = "";
  user_mname: string = "";
  user_lname: string = "";
  user_role: string = "";
  user_department: string = "";
  user_email: string = "";
  user_tenure: string = "";


  dialogRef: any;

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    public dialog: MatDialog
  ) {}



  openModal(userId: string): void {
   
    this.saveAuditTrailLog("View User Info ID: "+userId+"");

    this.dialogRef = this.dialog.open(ModalDialogComponent,{
      width: '40%',
      data: {
        menu_title: 'Account Management',
        menu_subtitle: 'User Details',
        menu_details: 'User ID: '+userId
      }
    });

    this.dialogRef.afterClosed().subscribe((result:any) => {
      
    });


  }  

  certifyUser(userId: string){

    this.router.navigate(['/certify-user/',userId,"none"])

  } // certifyUser

  getProposalIntakes(){

    this.inputService.getIntakeFormService(this.router.url).subscribe(data=>{

      this.proposalIntakes = data;

    });

  } // getProposalIntakes()

  getProposalDocuments(){

    this.inputService.getProposalService(this.router.url).subscribe(data=>{

      this.proposalDocuments = data;

    });

  } // getProposalDocuments()
   

  ngOnInit(): void {
  
    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){

      const jsonString = JSON.parse(this.dataString);   
      this.userId = jsonString._id;
      this.role_name = jsonString.role;

      this.getProposalIntakes();
      this.getProposalDocuments();

    }else{
      this.router.navigate(['/login']);
    }

    this.saveAuditTrailLog("View User Management Table");
    this.onClickAllRecords();
   
  } // ngOnInit()

  onClickAllRecords(){
    this.inputService
    .getUserAccounts(this.router.url)
    .subscribe((data) => (this.usersAccountForm = data));

    if(this.usersAccountForm){
      this.usersAccountForm = this.sortByDate(this.usersAccountForm,"createdAt", true);
    }    

  } // ngOnInit()



  
  onClickAuditTrail(){
    this.router.navigate(['/audit-trail'])
  }

  onCreateAccount(){
    this.router.navigate(['/register']);
  }

  onSearchChange(){

    if(this.searchInput === ""){
      this.onClickAllRecords();
    }

  }

  onClickSearch(){

    this.usersAccountForm = this.usersAccountForm.filter((item:any) => {

      return item.lname.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.fname.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.mname.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.role.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.department.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.createdAt.toLowerCase().includes(this.searchInput.toLowerCase());

    })

  }

  
  

  onInputImplementationIntake() {
    try {
      this.router.navigate(['']);
    } catch (error) {}
  }
  onAddClickIntake() {
    this.router.navigate(['project-proposal-student']);
  }

  onClickEditUserDetails(user_id_selected: string){
    this.router.navigate(['user-edit',user_id_selected])
  }
  
  sortByDate(data: any[], property: string, descending = false): any[] {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDate

  initializeAuditTrail(actionTaken:string) : void{
    
    this.auditTrailForm = this.fb.group({

      user_id: this.userId,     
      role: this.role_name,
      action_taken: actionTaken,
      action_date_time: new Date()      
    
    });

  }

  onRecordAuditTrailLogs(){

    this.inputService.createAuditTrailService(this.auditTrailForm.value).subscribe(
      (response) => {
        console.log('Data for Audit Trail Submitted Successfully:', response);      
      },
      (error) => {
        console.error('Error submitting form of Audit Trail:', error);
        // Handle error logic if needed
      }
    );

  }

  saveAuditTrailLog(actionString:string):void{
    this.initializeAuditTrail(actionString);
    this.onRecordAuditTrailLogs();
  }
  

}
