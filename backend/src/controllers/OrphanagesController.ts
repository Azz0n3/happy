import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanage_view';

export default {
    async create(request: Request, response: Response) {
        const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } = request.body;
        const data = { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().max(300).required(),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        });

        const isTrueSet = (open_on_weekends.toLowerCase() == 'true');

        await schema.validate(data, { abortEarly: false });

        const requestImages = request.files as Express.Multer.File[];
        const orphanageRepository = getRepository(Orphanage);

        const images = requestImages.map(image => {
            return { path: image.filename }
        });

        const orphanage = orphanageRepository.create({ name, latitude, longitude, about, instructions, opening_hours, open_on_weekends: isTrueSet, images });

        await orphanageRepository.save(orphanage);

        response.status(201).json(orphanage);
    },

    async index(request: Request, response: Response) {
        const orphanageRepository = getRepository(Orphanage);

        const orphanages = await orphanageRepository.find({
            relations: ['images']
        });

        response.status(201).json(orphanageView.renderMany(orphanages));
    },

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const orphanageRepository = getRepository(Orphanage);

        const orphanage = await orphanageRepository.findOneOrFail(id, {
            relations: ['images']
        });

        response.status(201).json(orphanageView.render(orphanage));
    },
}