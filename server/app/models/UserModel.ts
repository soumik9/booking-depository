import { Schema, model } from 'mongoose';
import { IUser, UserModel } from '../../interfaces/modelTypes';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser, UserModel, {}>({
    name: {
        type: String,
        required: [true, 'Naame is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
}, { timestamps: true });

// checking is admin exists
userSchema.statics.isUserExist = async function (param: string): Promise<Partial<IUser> | null> {
    return await this.findOne({ email: param }).select('password').exec();
}

// checking is password matched
userSchema.statics.isPasswordMatched = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
};

// password hashing before saving or creating
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));

    this.password = hashedPassword;

    next();
});

// Exclude password field from response
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
    }
});

const User = model<IUser, UserModel>("User", userSchema);
export default User;