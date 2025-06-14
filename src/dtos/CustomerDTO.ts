class CustomerDTO {
  id?: number;
  userId?: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  note: string;
  created_date?: Date;
  updated_date?: Date;


  constructor(
    id: number | undefined,
    userId: string | undefined,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
    note: string,
    created_date?: Date,
    updated_date?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.note = note;
    this.created_date = created_date;
    this.updated_date = updated_date;
  }
}

export default CustomerDTO;