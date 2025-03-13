import http from "@utils/request";

interface ItaskPage{
    current:number;
    size:number;
    taskName?:string;
    status?:string;
}

export interface TaskRecord {
    id: string;
    taskName: string;
    taskContent: string | null;
    downloadUrl: string;
    status: number; 
    errorLog: string | null;
    createBy: string;
    createTime: number;
    updateBy: string | null;
    updateTime: number | null;
}
  
interface TaskListResponse {
    code: string;
    msg: string;
    data: {
      records: TaskRecord[];
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

//任务列表
export const taskPage = ( data:ItaskPage ):Promise<TaskListResponse>=>{
	return http.get<TaskListResponse>('/crm/task/page',data)
}


interface ItaskDelete{
    msg:string;
    code:string;
    data:null;
}

//删除任务
export const taskDelete = ( data:string ):Promise<ItaskDelete>=>{
	return http.get<ItaskDelete>(`/crm/task/delete/${data}`)
}
