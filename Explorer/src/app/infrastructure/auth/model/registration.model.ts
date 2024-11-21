export interface Registration {
    name: string,
    surname: string,
    email: string,
    username: string,
    password: string,
    profilePicture?: string,
    imageBase64: string;
    biography?: string,
    motto?: string
}