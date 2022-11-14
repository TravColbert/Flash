module.exports = function (orm) {
  return {
    name: 'card',
    definition: {
      front: orm.TEXT,
      back: orm.TEXT,
      owner: {
        type: orm.TEXT,
        allowNull: true
      },
      public: {
        type: orm.BOOLEAN,
        defaultValue: false
      }
    },
    association: async (db) => {
      await db.models.card.belongsToMany(db.models.tag, { through: 'CardTag' })
    },
    seed: [
      {
        front: 'Aardvark',
        back: 'A medium-sized, burrowing, nocturnal mammal native to Africa. It is the only living species of the order Tubulidentata, although other prehistoric species and genera of Tubulidentata are known. Unlike most other insectivores, it has a long pig-like snout, which is used to sniff out food.',
        public: true
      },
      {
        front: 'Lion',
        back: 'A fierce animal.',
        public: true
      },
      {
        front: 'Kitten',
        back: 'A lovable animal.',
        public: true
      },
      {
        front: 'Snake',
        back: 'A tricky animal.',
        public: true
      },
      {
        front: 'Pig',
        back: 'A yummy animal.',
        public: true
      },
      {
        front: 'Eagle',
        back: 'A flying animal.',
        public: true
      },
      {
        front: 'Shark',
        back: 'A vicious swimming animal.',
        public: false
      }
    ]
  }
}
