function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function init(){
    var url = 'https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1rJ5gt-JaburVcfzTeNmLglEWfhTlEuoaOedTH5T7Qek/edit%23gid%3D0&strip-headers=on&force=on';

    var topLevelCall = $.ajax({ 
        type: 'GET', 
        url: url,
        dataType: 'json',
    });

    $.when(topLevelCall).then(function(topLevelArgs){
        var appeals = [];
        var data = hxlProxyToJSON(topLevelArgs);
        data.forEach(function(d){
            if(appeals.indexOf(d['#meta+id'])==-1){
                appeals.push(d['#meta+id'])
            }
        });
        var html='';
        appeals.forEach(function(d){
            html='<div id="'+d+'" class="col-md-12"><h3>'+d+'</h3><button id="'+d+'update">Update</button></div>';
            $('#appeals').append(html);
            $('#'+d+'update').on('click',function(){
                var url = 'https://proxy.hxlstandard.org/data.json?filter01=select&select-query01-01=%23meta%2Bid%3D'+d+'&url=https%3A//docs.google.com/spreadsheets/d/1rJ5gt-JaburVcfzTeNmLglEWfhTlEuoaOedTH5T7Qek/edit%3Fusp%3Dsharing&strip-headers=on';
                var appealCall = $.ajax({ 
                    type: 'GET', 
                    url: url,
                    dataType: 'json',
                });
                $.when(appealCall).then(function(appealArgs){
                    var data = hxlProxyToJSON(appealArgs);
                    data.forEach(function(d){
                        var url = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url='+encodeURIComponent(d['#meta+url']);
                        console.log(url);
                        $.ajax({ 
                            type: 'GET', 
                            url: url,
                            dataType: 'json',
                            success: function(){
                                console.log('#'+d['#meta+id']+d['#meta+feature']);
                                $('#'+d['#meta+id']+d['#meta+feature']).append(' - Updated');
                            }
                        });
                    });
                });
            });
        });
        data.forEach(function(d){
            $('#'+d['#meta+id']).append('<p id='+d['#meta+id']+d['#meta+feature']+'>'+d['#meta+feature']+'</p>');
        });
        $('#loadingmodal').modal('hide');
    });
    
}
init();