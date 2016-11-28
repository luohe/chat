$(function(){
  $(".del").click(function(e){
    var target = $(e.target)
    var id = target.data("id")
    var tr = $(".item-id-"+id)
    console.log("ass")
    $.ajax({
      type:'DELETE',
      url:'/admin/movie/list?id='+id
    })
    .done(function(result){
      if(result.success = 1){
        if(tr.length>0){
          tr.remove()
        }
      }
    })
  });

  $("#douban").blur(function(){
    var $douban = $("#douban")
    var $id = $douban.val();
    if($id){
      $.ajax({
        url:"https://api.douban.com/v2/movie/subject/"+$id,
        cache:true,
        type:"get",
        dataType:"jsonp",
        crossDomain:true,
        jsonp:"callback",
        success:function(date){
          $("#inputTitle").val(date.title);
          $("#inputDoctor").val(date.directors[0].name)
          $("#inputCountry").val(date.countries[1])
          $("#inputPoster").val(date.images.large)
          $("#inputYear").val(date.year)
          $("#inputSummary").val(date.summary)
        }
      })
    }
  })
});