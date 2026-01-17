import { Model, Document } from 'mongoose';

export class BaseService<T extends Document> {
	protected model: Model<T>;

	constructor(model: Model<T>) {
		this.model = model;
	}

	async findAll(filter: any = {}): Promise<T[]> {
		return await this.model.find(filter);
	}

	async findById(id: string): Promise<T | null> {
		return await this.model.findById(id);
	}
}
