import { NextApiResponse } from 'next'
import { Request } from '../../../types'
import nc from 'next-connect'
import { doc } from '../../../db'
import middleware from '../../../middleware/all'
import onError from '../../../middleware/error'

const handler = nc<Request, NextApiResponse>({
  onError,
})

handler.use(middleware)

handler.post(async (req, res) => {
  const newDoc = doc.createDoc(req.db, {
    ...req.body,
    createdBy: req.user.id,
  })
  res.send({ data: newDoc })
})

export default handler
