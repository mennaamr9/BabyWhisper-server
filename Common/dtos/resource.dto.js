class ResourceDTO {
    constructor(resource) {
      if (!resource) throw new Error('Resource entity is required.');
      this.resource_id = resource.resource_id;
      this.type = resource.type;
      this.title = resource.title;
      this.content = resource.content;
      this.category = resource.category;
    }
  }
  
  module.exports = ResourceDTO;
  