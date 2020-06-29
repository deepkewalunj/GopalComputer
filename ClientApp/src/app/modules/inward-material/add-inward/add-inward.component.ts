import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

const models = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-add-inward',
  templateUrl: './add-inward.component.html',
  styleUrls: ['./add-inward.component.scss']
})
export class AddInwardComponent implements OnInit {

  public modelNumber: any;
  public moreCompanyName: any;
  public materiaType: any;
  public addAccessories: any;
  

  hideTag = true;
  tags = [];


    /*phone masking*/
    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    /*phone validation*/
    @Input()
    maxlength: number;


  // we used reactive forms and validations

  @Input() account: Account;
  addInwardForm: FormGroup;

//add company form
  addCompanyForm: FormGroup;

//add material form
  addMaterialForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
   this.createForm();
  }

  createForm() { 
    this.addInwardForm = this.fb.group({
      inwardDate:   ['', Validators.required],
      companyName:  ['', Validators.required],
      materialName:   ['', Validators.required],
      barCode:  ['', Validators.required],
      receiverName: ['', Validators.required],
      deliveryDate:          ['', Validators.required],
    });

    //add company form form-builder
    this.addCompanyForm = this.fb.group({
      personName:      ['', Validators.required],
      companyName:      ['', Validators.required],
      ownerNumber:['', Validators.required],
    });

    //add materil form form-builder
    this.addMaterialForm = this.fb.group({
      moreCompanyName:      ['', Validators.required],
      materiaType:      ['', Validators.required],
      modelNumber:['', Validators.required],
    })
   
  }

 

  /*on click modal will be open*/
  open(content) {
    this.modalService.open(content);
  }

  addCompanyPopup(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  addMaterialPopup(content) {
    this.modalService.open(content, { size: 'lg' });
  }



  // multiselect dropdown code here
  
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  ngOnInit(){
                 
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : models.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  // add-tags

  addTags(newTag: string) {
    if (newTag) {
      this.tags.push(newTag);
    }
  }
// delets-tags
  deleteTag(index) {
    this.tags.splice(index, 1);
  }


}
