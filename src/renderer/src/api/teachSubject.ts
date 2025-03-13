import http from "@utils/request";

export interface IsubjectList{
    current:number;
    size:number;
    subjectName?:string;
    enabled?:string;
}

export interface IsubjectPage {
	id: string;
	subjectName: string;
	enabled: "0" | "1";
	createBy: string;
	createTime: number;
	updateBy: string | null;
	updateTime: number | null;
}
 
interface IsubjectPageData {
	code: string;
	msg: string;
	data: {
	  records: IsubjectPage[];
	  total: number;
	  size: number;
	  current: number;
	  orders: any[]; 
	  optimizeCountSql: boolean;
	  searchCount: boolean;
	  countId: any; 
	  maxLimit: any;
	  pages: number;
	};
}

//科目列表
export const subjectPage = ( data:IsubjectList ):Promise<IsubjectPageData>=>{
	return http.get<IsubjectPageData>('/crm/teach/subject/page',data)
}



export interface IGradeData {
	id: string;
	subjectId: string;
	gradeName: string;
	amount: number;
	protocol: string;
	enabled: number;
	delFlag: number;
	createBy: string;
	createTime: number;
	updateBy: string | null;
	updateTime: number | null;
}
  
interface IGradeAll {
	code: string;
	msg: string;
	data: IGradeData[];
}

//查询科目等级
export const gradeAll = ( data:{
	subjectId:string;
} ):Promise<IGradeAll>=>{
	return http.get<IGradeAll>('crm/teach/grade/all',data)
}

interface IsubjectAdd{
	code:string;
	msg:string;
	data:null;
}

//添加科目
export const subjectAdd = ( data:{
	subjectName:string;
	enabled:string;
} ):Promise<IsubjectAdd>=>{
	return http.post<IsubjectAdd>('/crm/teach/subject/add',data)
}

//删除科目
export const subjectDelete = ( data:string ):Promise<IsubjectAdd>=>{
	return http.get<IsubjectAdd>(`/crm/teach/subject/delete/${data}`)
}


interface IsubjectGet{
	id:string;
	subjectName:string;
	enabled:string;
	createBy:string;
	createTime:number;
	updateBy:null;
	updateTime:null;
}

interface IsubjectGetData{
	code:string;
	msg:string;
	data:IsubjectGet;
}

//科目详情
export const subjectGet = ( data:string ):Promise<IsubjectAdd>=>{
	return http.get<IsubjectAdd>(`/crm/teach/subject/get/${data}`)
}


interface IsubjectUpdata{
	id:string;
	subjectName:string;
	enabled:string;
	amount?:string;
	protocol?:string;
}

//修改科目
export const subjectUpdata = ( data:IsubjectUpdata ):Promise<IsubjectAdd>=>{
	return http.post<IsubjectAdd>('/crm/teach/subject/update',data);
}


//导出科目
export const subjectExport = ( data:{
	subjectName:string | undefined;
	enabled:string | undefined;
} ):Promise<IsubjectAdd>=>{
	return http.get<IsubjectAdd>('/crm/teach/subject/export',data);
}
