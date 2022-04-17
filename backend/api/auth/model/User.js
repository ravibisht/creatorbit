import  prisma from '@prisma/client/scripts/'
import { exclude } from '../../../core/util/exclude'

const { User } = prisma
export default exclude(User, 'password')
