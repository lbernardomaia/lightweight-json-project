/*! Widget: sort2Hash (BETA) - updated 11/2/2015 (v2.24.1) */
/* Requires tablesorter v2.8+ and jQuery 1.7+
 * by Rob Garrison
 */
;( function( $ ) {
	'use strict';
	var ts = $.tablesorter || {},
	s2h = {
		init : function( c, wo ) {
			var filter, temp, page, size,
				table = c.table,
				pager = c.pager,
				hasSaveSort = ts.hasWidget( table, 'saveSort' ),
				sort = s2h.decodeHash( c, wo, 'sort' );
			if ( ( sort && !hasSaveSort ) || ( sort && hasSaveSort && wo.sort2Hash_overrideSaveSort ) ) {
				s2h.convertString2Sort( c, wo, sort );
			}
			if ( ts.hasWidget( c.table, 'pager' ) ) {
				temp = parseInt( s2h.decodeHash( c, wo, 'page' ), 10 );
				page = pager.page = ( temp < 0 ? 0 : ( temp > pager.totalPages ? pager.totalPages - 1 : temp ) ) + 1;
				size = pager.size = parseInt( s2h.decodeHash( c, wo, 'size' ), 10 );
			}
			if ( ts.hasWidget( table, 'filter' ) ) {
				filter = s2h.decodeHash( c, wo, 'filter' );
				if ( filter ) {
					filter = filter.split( wo.sort2Hash_separator );
					c.$table.one( 'tablesorter-ready', function() {
						setTimeout(function(){
							c.$table.one( 'filterEnd', function(){
								$(this).trigger( 'pageAndSize', [ page, size ] );
							});
							$.tablesorter.setFilters( table, filter, true );
						}, 100 );
					});
				}
			} else {
				c.$table.trigger( 'pageAndSize', [ page, size ] );
			}
			c.$table.on( 'sortEnd.sort2hash filterEnd.sort2hash pagerComplete.sort2Hash', function() {
				if ( this.hasInitialized ) {
					s2h.setHash( this.config, this.config.widgetOptions );
				}
			});
		},

		getTableId : function( c, wo ) {
			// option > table id > table index on page
			return wo.sort2Hash_tableId ||
				c.table.id ||
				'table' + $( 'table' ).index( c.$table );
		},
		regexEscape : function( v ) {
			return v.replace( /([\.\^\$\*\+\-\?\(\)\[\]\{\}\\\|])/g, '\\$1');
		},
		// convert 'first%20name,asc,last%20name,desc' into [[0,0], [1,1]]
		convertString2Sort : function( c, wo, sortHash ) {
			var regex, column, direction, temp, index, $cell,
				arry = sortHash.split( wo.sort2Hash_separator ),
				indx = 0,
				len = arry.length,
				sort = [];
			while ( indx < len ) {
				// column index or text
				column = arry[ indx++ ];
				temp = parseInt( column, 10 );
				// ignore wo.sort2Hash_useHeaderText setting &
				// just see if column contains a number
				if ( isNaN( temp ) || temp > c.columns ) {
					regex = new RegExp( '(' + s2h.regexEscape( column ) + ')', 'i' );
					for ( index = 0; index < c.columns; index++ ) {
						$cell = c.$headerIndexed[ index ];
						if ( regex.test( $cell.attr( wo.sort2Hash_headerTextAttr ) ) ) {
							column = index;
							index = c.columns;
						}
					}
				}
				direction = arry[ indx++ ];
				// ignore unpaired values
				if ( typeof column !== 'undefined' && typeof direction !== 'undefined' ) {
					// convert text to 0, 1
					if ( isNaN( direction ) ) {
						// default to ascending sort
						direction = direction.indexOf( wo.sort2Hash_directionText[ 1 ] ) > -1 ? 1 : 0;
					}
					sort.push( [ column, direction ] );
				}
			}
			if ( sort.length ) {
				c.sortList = sort;
			}
		},

		// convert [[0,0],[1,1]] to 'first%20name,asc,last%20name,desc'
		convertSort2String : function( c, wo ) {
			var index, txt, column, direction,
				sort = [],
				arry = c.sortList || [],
				len = arry.length;
			for ( index = 0; index < len; index++ ) {
				column = arry[ index ][ 0 ];
				txt = $.trim( c.$headerIndexed[ column ].attr( wo.sort2Hash_headerTextAttr ) );
				sort.push( txt !== '' ? encodeURIComponent( txt ) : column );
				direction = wo.sort2Hash_directionText[ arry[ index ][ 1 ] ];
				sort.push( direction );
			}
			// join with separator
			return sort.join( wo.sort2Hash_separator );
		},

		convertFilter2String : function( c, wo ) {
			var index, txt, column, direction,
				sort = [],
				arry = c.sortList || [],
				len = arry.length;
			for ( index = 0; index < len; index++ ) {
				column = arry[ index ][ 0 ];
				txt = $.trim( c.$headerIndexed[ column ].attr( wo.sort2Hash_headerTextAttr ) );
				column = typeof txt !== 'undefined' ? encodeURIComponent( txt ) : column;
				sort.push( column );
				direction = wo.sort2Hash_directionText[ arry[ index ][ 1 ] ];
				sort.push( direction );
			}
			// join with separator
			return sort.join( wo.sort2Hash_separator );
		},

		encodeHash : function( c, wo, component, value, rawValue ) {
			var result = false,
				tableId = s2h.getTableId( c, wo );
			if ( typeof wo.sort2Hash_encodeHash === 'function' ) {
				result = wo.sort2Hash_encodeHash( c, tableId, component, value, rawValue || value );
			}
			if ( result === false ) {
				result = '&' + component + '[' + tableId + ']=' + value;
			}
			return result;
		},

		decodeHash : function( c, wo, component ) {
			var regex,
				result = false,
				tableId = s2h.getTableId( c, wo );
			if ( typeof wo.sort2Hash_decodeHash === 'function' ) {
				result = wo.sort2Hash_decodeHash( c, tableId, component );
			}
			if ( result === false ) {
				regex = new RegExp( '[\\#&]' + component + '\\[' + s2h.regexEscape( tableId ) + '\\]=([^&]*)' ),
				/*jshint -W030 */
				result = regex.exec( window.location.hash );
			}
			return result ? decodeURIComponent( result[ 1 ] ) : '';
		},

		cleanHash : function( c, wo, component, hash ) {
			var index, len, parts, regex,
				result = false,
				tableId = s2h.getTableId( c, wo );
			if ( typeof wo.sort2Hash_cleanHash === 'function' ) {
				result = wo.sort2Hash_cleanHash( c, tableId, component, hash );
			}
			if ( result === false ) {
				result = [];
				parts = ( hash || '' ).slice(1).split( '&' );
				len = parts.length;
				regex = new RegExp( component + '\\[' + s2h.regexEscape( tableId ) + '\\]=([^&]*)' );
				for ( index = 0; index < len; index++ ) {
					if ( !regex.test( parts[ index ] ) ) {
						result.push( parts[ index ] );
					}
				}
			}
			return result.length ? '#' + result.join( '&' ) : '';
		},

		setHash : function( c, wo ) {
			var str = '',
				hash = window.location.hash,
				hasPager = ts.hasWidget( c.table, 'pager' ),
				hasFilter = ts.hasWidget( c.table, 'filter' ),
				sortList = s2h.convertSort2String( c, wo ),
				filters = ( hasFilter && c.lastSearch.join('') !== '' ? c.lastSearch : [] ),
				filtersStr = encodeURIComponent( filters.join( c.widgetOptions.sort2Hash_separator ) ),
				components = {
					'sort'   : sortList ? s2h.encodeHash( c, wo, 'sort', sortList, c.sortList ) : '',
					'page'   : hasPager ? s2h.encodeHash( c, wo, 'page', c.pager.page + 1 ) : '',
					'size'   : hasPager ? s2h.encodeHash( c, wo, 'size', c.pager.size ) : '',
					'filter' : filtersStr ? s2h.encodeHash( c, wo, 'filter', filtersStr, filters ) : ''
				};
			// remove old hash
			$.each( components, function( component, value ) {
				hash = s2h.cleanHash( c, wo, component, hash );
				str += value;
			});
			// add updated hash
			window.location.hash = ( ( window.location.hash || '' ).replace( '#', '' ).length ? hash : wo.sort2Hash_hash ) + str;
		}
	};

	ts.addWidget({
		id: 'sort2Hash',
		priority: 60, // after saveSort & pager
		options: {
			sort2Hash_hash              : '#',      // hash prefix
			sort2Hash_separator         : '-',      // don't '#' or '=' here
			sort2Hash_headerTextAttr    : 'data-header', // data attribute containing alternate header text
			sort2Hash_directionText     : [ 0, 1 ], // [ 'asc', 'desc' ],
			sort2Hash_overrideSaveSort  : false     // if true, override saveSort widget if saved sort available

			// Options below commented out for improved compression
			// ******************
			// sort2Hash_tableId           : null,     // this option > table ID > table index on page,
			// custom hash processing functions
			// sort2Hash_encodeHash        : null,
			// sort2Hash_decodeHash        : null,
			// sort2Hash_cleanHash         : null
		},
		init: function(table, thisWidget, c, wo) {
			s2h.init( c, wo );
		},
		remove: function(table, c) {
			c.$table.off( '.sort2hash' );
		}
	});

})(jQuery);