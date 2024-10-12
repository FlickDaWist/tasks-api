## Project Pattern Used :

From the view of known design patterns :
 - Repository pattern for handling typeorm database queries and keeping the query action scope to a each entities
 - Decorator pattern used to call nestjs utils without directly write the implementation it inside the codebase
 - Facade pattern by breaking business logic from controllers to services and simplify it

Architectures :
- Modular, allow separation of business logic of entities, reusing it in other module
- Dependency injection for reusable components without directly implementing it inside a class/funcitons and maintain loose coupling
