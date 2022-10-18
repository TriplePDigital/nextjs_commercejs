import { signUpHandler } from 'next-auth-sanity'
import { client } from '@/util/config'

export default signUpHandler(client)
