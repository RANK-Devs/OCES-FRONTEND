import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { InputService } from '../../services/input.service';

@Component({
  selector: 'app-view-uploaded-images',
  templateUrl: './view-uploaded-images.component.html',
  styleUrl: './view-uploaded-images.component.scss'
})
export class ViewUploadedImagesComponent {

  fileUploads!:any;
  fileUploadFilter!:any;
  cloud_file_path: string = "";
  cloud_file_paths: string[] = [];

  dataString: any;
  role_name: String = "";
  userId: string = "";

  constructor(private actRoute: ActivatedRoute, private router: Router, private inputService: InputService){

  }

  ngOnInit(){

    const id = this.actRoute.snapshot.paramMap.get('id');

    if(id){
      this.viewFileUpload(id);
    }

    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.role_name = jsonString.role;
      this.userId = jsonString._id; 


    }else{
      this.router.navigate(['/login']);
    }

  } // ngOnInit()

  ngAfterInit(){

    const id = this.actRoute.snapshot.paramMap.get('id');

    if(id){
      this.viewFileUpload(id);
    }

    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.role_name = jsonString.role;
      this.userId = jsonString._id; 


    }else{
      this.router.navigate(['/login']);
    }

  } // ngAfterInit()


  viewFileUpload(proposal_id: string){

    this.inputService.getFileUploadService(this.router.url).subscribe((data:any)=>{

      this.fileUploads = data;

      this.fileUploadFilter = this.fileUploads.filter((item_filter:any)=>{

        return item_filter.proposal_id.includes(proposal_id) && item_filter.file_type.includes("image");

      }); // this.fileUploadFilter

     

    });

  } // viewFileUpload()
}
