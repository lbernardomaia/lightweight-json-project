// Functions glossary.htm

var tableSorterGlossary = function (){
    $("#glossary").tablesorter({
        sortLocaleCompare : true,
        ignoreCase : true,
        sortList: [[0,0]]
    });
}

var populateGlossary = function (){
    var glossaryData = JSON.parse(glossary);

    var glossaryContent = '';
    $.each(glossaryData, function( index ) {
        glossaryContent += '<tr>';
        glossaryContent += '<td>' + glossaryData[index].acronym + '</td>';
        glossaryContent += '<td>' + glossaryData[index].meaning + '</td>';
        glossaryContent += '</tr>';
    });

    $('#glossary tbody').append(glossaryContent);
}

// Functions file.htm

var tableSorterFiles = function (){
	$("#files").tablesorter({
		sortLocaleCompare : true,
		ignoreCase : true,
		sortList: [[0,0]]
	});
}

var populateFiles = function (){
	var fileData = JSON.parse(files);

	var fileContent = '';
	$.each(fileData, function( index ) {
		fileContent += '<tr>';
		fileContent += '<td>' + fileData[index].description + '</td>';
		fileContent += '<td><a href="' + fileData[index].path + '" target="_blank">' + fileData[index].name + '</a></td>';
		fileContent += '</tr>';
	});

	$('#files tbody').append(fileContent);
}

// Functions contact.htm

var tableSorterCustomers = function (){
    var pagerOptions = { container: $(".pagerCustomers") };

    $('#customers').tablesorter({
        widgets: ["filter"],
        sortLocaleCompare : true,
        ignoreCase : true,
        sortList: [[0,0]],
        widgetOptions : {
            filter_external : '.search-customers',
            filter_defaultFilter: { 1 : '~{query}' },
            filter_columnFilters: false,
            filter_placeholder: { search : 'Search...' },
            filter_saveFilters : false,
            filter_reset: '.clean-customers'
        }
    }).tablesorterPager(pagerOptions);
}

var populateCustomers = function (){
    var customersData = JSON.parse(customers);

    var customersContent = '';
    $.each(customersData, function( index ) {
        customersContent += '<tr>';
        customersContent += '<td>' + customersData[index].name + '</td>';
        customersContent += '<td>' + customersData[index].email + '</td>';
        customersContent += '<td>' + customersData[index].company + '</td>';
        customersContent += '<td>' + customersData[index]['phone-fax'] + '</td>';
        customersContent += '</tr>';
    });

    $('#customers tbody').append(customersContent);
}

var tableSorterVendors = function (){
    var pagerOptions = { container: $(".pagerVendors") };

    $('#vendors').tablesorter({
        widgets: ["filter"],
        sortLocaleCompare : true,
        ignoreCase : true,
        sortList: [[0,0], [1,0]],
        widgetOptions : {
            filter_external : '.search-vendors',
            filter_defaultFilter: { 1 : '~{query}' },
            filter_columnFilters: false,
            filter_placeholder: { search : 'Search...' },
            filter_saveFilters : false,
            filter_reset: '.clean-vendors'
        }
    }).tablesorterPager(pagerOptions);
}


var populateVendors = function (){
    var vendorsData = JSON.parse(vendors);

    var vendorsContent = '';
    $.each(vendorsData, function( index ) {
        vendorsContent += '<tr>';
        vendorsContent += '<td>' + vendorsData[index].name + '</td>';
        vendorsContent += '<td>' + vendorsData[index].email + '</td>';
        vendorsContent += '<td>' + vendorsData[index].company + '</td>';
        vendorsContent += '<td>' + vendorsData[index]['phone-fax'] + '</td>';
        vendorsContent += '</tr>';
    });

    $('#vendors tbody').append(vendorsContent);
}