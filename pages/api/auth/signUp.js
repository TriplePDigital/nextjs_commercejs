import { signUpHandler } from 'next-auth-sanity'
import { configuredSanityClient } from '../../../util/img'

export default signUpHandler(configuredSanityClient)
