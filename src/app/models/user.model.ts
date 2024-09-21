import { DateOfBirthday, UserResult } from './api-result.model'

interface LoginInfo extends Object {
  uuid: string
  username: string
  password: string
  salt: string
  md5: string
  sha1: string
  sha256: string
}

interface Location {
  street: {
    number: number;
    name: string;
  };
  city: string;
  state: string;
  country: string;
  postcode: string | number;
  timezone: {
    offset: string;
    description: string;
  };
}

export class User {
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  image?: string
  nat?: string
  gender?: string
  login?: LoginInfo
  location?: Location
  dob?: DateOfBirthday
  index?: number  // Optional index property for tracking

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data)
  }

  /**
   * Gets an image source url with a query string to prevent caching
   * Note: Do not remove the query string.
   */
  get imageSrc(): string {
    return `${this.image}?id=${this.login?.uuid}`
  }

  /**
   * Gets a formatted address string.
   */
  get formattedAddress(): string {
    if (!this.location) return ''
    const { street, city, state, country, postcode } = this.location
    return `${street.number} ${street.name}, ${city}, ${state}, ${country} ${postcode}`
  }

  /**
   * Maps the api result to an array of User objects and assigns index to each user.
   * @param {UserResult[]} userResults
   * @returns {User[]}
   */
  static mapFromUserResult(userResults: UserResult[]): User[] {
    return userResults.map((user, i) => new User({
      firstname: user.name.first,
      lastname: user.name.last,
      email: user.email,
      phone: user.phone,
      image: user.picture.medium,
      location: user.location,
      nat: user.nat,
      gender: user.gender,
      login: user.login,
      dob: user.dob,
      index: i
    }))
  }
}
