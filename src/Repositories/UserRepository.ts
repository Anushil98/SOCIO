import bcrypt from "bcryptjs";
import { EntityRepository, getRepository, Repository } from "typeorm";
import { College } from "../entity/College";
import { Student } from "../entity/Student";
import { User } from "../entity/User";
import { SignUpArgs } from "../types/User.type";
import { logger } from "../utils/pino.utils";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  createNew = async (data: SignUpArgs): Promise<User> => {
    try {
      const { email, userType, age, collegeName, firstname, gender, lastname, password } = data;
      const emailAvailability = await getRepository(User).count({ email });

      if (emailAvailability === 0) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User();
        user.email = email;
        user.UserType = userType;
        user.password = hash;

        const addedUser = await getRepository(User).save(user);

        if (userType === "College") {
          const college = new College();
          college.collegeName = collegeName;
          college.userId = addedUser.id;
          await getRepository(College).save(college);
        }
        const student = new Student();
        student.firstname = firstname;
        student.lastname = lastname;
        student.gender = gender;
        student.age = age;
        student.userId = addedUser.id;
        await getRepository(Student).save(student);
        return addedUser;
      }
      throw new Error("Email already exist");
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };
}
