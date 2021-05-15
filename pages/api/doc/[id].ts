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

handler.put(async (req, res) => {
  const updatedDoc = await doc.updateOne(req.db, req.query.id as string, req.body)
  res.send({ data: updatedDoc })
})

export default handler
