import { createToken } from './../middleware/authontication';
import { User, IUser } from './../model/user';
import { mergeMap, of, from, map, forkJoin } from "rxjs";
import UserSchema from "../db/user"
import bcrypt from "bcrypt"
import { Observable } from 'rx';


export class UserController {
  public static createUser(body) {
    const user = new User(body)
    console.log(user)
    return of(user).pipe(
      mergeMap((m) => from(bcrypt.hash(m.password, 10))),
      mergeMap((m) => from(UserSchema.create({ ...user, password: m }))),
      map((m) => {
        return { token: createToken({ ...m }), id : m._id }
      })
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static findUser(id: string) {
    return of(true).pipe(
      mergeMap(() => UserSchema.findById(id).select(["-password"])),
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static findAllUserPagination(pn: number) {
    return of(true).pipe(
      mergeMap(() => {
        return forkJoin([
          this.allUser(pn),
          this.userCount()
        ])
      }),
      map((m) => ({ data: m[0], colSize: m[1] }))
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static allUser(pn: number) {
    return of(true).pipe(
      mergeMap(() => UserSchema.find({}).sort({ _id: -1 }).skip((pn - 1) * 10).limit(10).select("-password")),
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static userCount() {
    return of(true).pipe(
      mergeMap(() => UserSchema.find({}).count()),
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 

  public static deleteUser(id: string) {
    return of(true).pipe(
      mergeMap(() => UserSchema.findByIdAndDelete(id).select(["-password"]))
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static updateUser(id: string, data) {
    delete data.deposit
    return of(true).pipe(
      mergeMap(() => UserSchema.findByIdAndUpdate(id, data).select(["-password"]))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
}
