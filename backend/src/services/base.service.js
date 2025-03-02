export class BaseService {
	constructor(model) {
		this.model = model;
	}

	async findAll(filter = {}) {
		return await this.model.find(filter);
	}

	async findById(id) {
		return await this.model.findById(id);
	}
}
