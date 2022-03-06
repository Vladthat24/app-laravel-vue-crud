new Vue({
    el: '#crud',
    created: function () {
        this.getKeeps();
    },
    data: {
        keeps: [],
        pagination: {
            'total': 0,
            'current_page': 0,
            'per_page': 0,
            'last_page': 0,
            'from': 0,
            'to': 0
        },
        newKeep: '',
        fillKeep: { 'id': '', 'keep': '' },
        errors: [],
        offset:2
    },
    computed: {
        isActived: function () {
            return this.pagination.current_page;
        },
        pagesNumber: function () {
            if (!this.pagination.to) {
                return [];
            }

            //controlando la distancia que va tomar la paginacion
            var from = this.pagination.current_page - this.offset;
            if (from < 1) {
                from = 1;
            }

            var to = from + (this.offset * 2);//TODO
            if (to >= this.pagination.last_page) {

                to = this.pagination.last_page;
            }

            var pagesArray = [];
            while (from <= to) {
                pagesArray.push(from);
                from++;
            }
            return pagesArray;
        }
    },
    methods: {
        getKeeps: function (page) {
            var urlKeeps = 'tasks?page='+page;
            axios.get(urlKeeps).then(response => {
                this.keeps = response.data.tasks.data,
                    this.pagination = response.data.pagination
            })
        },
        editKeep: function (keep) {
            this.fillKeep.id = keep.id;
            this.fillKeep.keep = keep.keep;
            console.log(this.fillKeep.keep);
            $('#edit').modal('show');

        },
        updateKeep: function (id) {
            var url = 'tasks/' + id;
            console.log(id);
            axios.put(url, this.fillKeep).then(response => {
                this.getKeeps();
                //dejar en  blanco las variables
                this.fillKeep = { 'id': '', 'keep': '' };
                this.errors = [];
                $('#edit').modal('hide');
                toastr.success('Actualizado correctamente');
            }).catch(error => {
                this.errors = error.response.data
            });
        },
        deleteKeep: function (keep) {

            var url = 'tasks/' + keep.id;
            axios.delete(url).then(response => {
                this.getKeeps(); // para cargar el formulario
                toastr.success('Eliminado correctamente');//mensaje en TOASTR
            })
        },
        createKeep: function () {
            var urlKeeps = 'tasks';
            axios.post(urlKeeps, {
                keep: this.newKeep
            }).then(response => {
                this.getKeeps();
                this.newKeep = '';
                this.errors = [];

                $('#create').modal('hide');

                toastr.success('Nueva tarea creada con exito');
            }).catch(error => {
                this.errors = error.response.data
            })
        },
        changePage: function (page) {
            this.pagination.current_page = page;
            this.getKeeps(page);
        }
    }

});
