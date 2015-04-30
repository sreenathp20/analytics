var Lock = function () {

    return {
        //main function to initiate the module
        init: function () {
            var img_path = "static/new/images/"
             $.backstretch([
		        img_path+"1.jpg",
    		    img_path+"2.jpg",
    		    img_path+"3.jpg",
    		    img_path+"4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		      });
        }

    };

}();