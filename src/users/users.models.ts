export class UsersModel {
  name: string;
  email: string;
  avatar: string;
  status: string;

  constructor(name?: string, email?: string, avatar?: string, status?: string) {
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.status = status;
  }
}
