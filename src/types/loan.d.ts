export interface LoanSubmission {
  submission_date: string;
  nominal: number;          
  tenor: number;            
  description: string;      
  installment_amount: number
  remaining_loan_amount: num
  employee_id: number;      
  number: string;           
  id: string;               
  updated_at: string;       
  created_at: string;       
}

export interface CreateLoanPayload {
  submission_date: string; // format: "DD-MM-YYYY"
  nominal: number;
  tenor: number;
  description: string;
}

export interface CreateLoanResponse {
  success: boolean;
  message: string;
}

export interface GetMyLoansResponse {
  success: boolean;
  message: string;
  data?: any; // array of loans
}