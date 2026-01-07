/*
The MIT License (MIT)

Portions Copyright (c) 2015-2019, The OmniDB Team
Portions Copyright (c) 2017-2019, 2ndQuadrant Limited

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/// <summary>
/// Retrieving tree.
/// </summary>
function getTreeMysql(p_div) {

    var context_menu = {
        'cm_server': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_databases': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Database',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Database', node.tree
                        .tag.create_database);
                }
            }/*, {
                text: 'Doc: Databases',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Databases',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/managing-databases.html');
                }
            }*/]
        },
        'cm_database': {
            elements: [
                {
                    text: 'Switch Database',
                    icon: 'fas cm-all fa-exchange-alt',
                    action: function (node) {
                        switchDatabase(v_connTabControl.selectedTab.id, node.text);
                    },
                    submenu: {
                        elements: [{
                            text: 'Simple Graph',
                            icon: 'fab cm-all fa-hubspot',
                            action: function (node) {
                                v_connTabControl.tag.createGraphTab(
                                    node.text)
                                drawGraph(false, node.text);
                            }
                        }, {
                            text: 'Complete Graph',
                            icon: 'fab cm-all fa-hubspot',
                            action: function (node) {
                                v_connTabControl.tag.createGraphTab(
                                    node.text)
                                drawGraph(true, node.text);
                            }
                        }]
                    }
                },
                {
                    text: 'Alter Database',
                    icon: 'fas cm-all fa-edit',
                    action: function (node) {
                        tabSQLTemplate('Alter Database', node.tree.tag
                            .alter_database.replace(
                                '#database_name#', node.text));
                    }
                }, {
                    text: 'Drop Database',
                    icon: 'fas cm-all fa-times',
                    action: function (node) {
                        tabSQLTemplate('Drop Database', node.tree.tag
                            .drop_database.replace(
                                '#database_name#', node.text));
                    }
                }
            ]
        },
        'cm_roles': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Role',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Role', node.tree.tag
                        .create_role);
                }
            }/*, {
                text: 'Doc: Roles',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Roles',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/user-manag.html');
                }
            }*/]
        },
        'cm_role': {
            elements: [{
                text: 'Alter Role',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Alter Role', node.tree.tag.alter_role
                        .replace('#role_name#', node.text));
                }
            }, {
                text: 'Drop Role',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Role', node.tree.tag.drop_role
                        .replace('#role_name#', node.text));
                }
            }]
        },
        'cm_tables': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Table (GUI)',
                icon: 'fas cm-all fa-plus-square',
                action: function (node) {
                    startAlterTable(true, 'new', null, node.parent.text);
                }
            }, {
                text: 'Create Table (SQL)',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Table', node.tree.tag
                        .create_table.replace(
                            '#schema_name#', node.parent.text));
                }
            }/*, {
                text: 'Doc: Basics',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Table Basics',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/ddl-basics.html');
                }
            }, {
                text: 'Doc: Constraints',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Table Constraints',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/ddl-constraints.html');
                }
            }, {
                text: 'Doc: Modifying',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Modifying Tables',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/ddl-alter.html');
                }
            }*/]
        },
        'cm_table': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Data Actions',
                icon: 'fas cm-all fa-list',
                submenu: {
                    elements: [{
                        text: 'Query Data',
                        icon: 'fas cm-all fa-search',
                        action: function (node) {
                            TemplateSelectMysql(node.parent
                                .parent.text, node.text);
                        }
                    }, {
                        text: 'Edit Data',
                        icon: 'fas cm-all fa-table',
                        action: function (node) {
                            startEditData(node.text,
                                node.parent.parent.text
                            );
                        }
                    }, {
                        text: 'Insert Record',
                        icon: 'fas cm-all fa-edit',
                        action: function (node) {
                            TemplateInsertMysql(node.parent
                                .parent.text, node.text);
                        }
                    }, {
                        text: 'Update Records',
                        icon: 'fas cm-all fa-edit',
                        action: function (node) {
                            TemplateUpdateMysql(node.parent
                                .parent.text, node.text);
                        }
                    }, {
                        text: 'Count Records',
                        icon: 'fas cm-all fa-sort-numeric-down',
                        action: function (node) {

                            var v_table_name = '';
                            v_table_name = node.parent.parent.text + '.' + node.text;

                            v_connTabControl.tag.createQueryTab(
                                node.text);

                            v_connTabControl.selectedTab
                                .tag.tabControl.selectedTab
                                .tag.editor.setValue(
                                    "-- Counting Records\nselect count(*) as count\nfrom " +
                                    v_table_name + " t"
                                );
                            v_connTabControl.selectedTab
                                .tag.tabControl.selectedTab
                                .tag.editor.clearSelection();
                            renameTabConfirm(
                                v_connTabControl.selectedTab
                                    .tag.tabControl.selectedTab,
                                node.text);

                            querySQL(0);
                        }
                    }, {
                        text: 'Delete Records',
                        icon: 'fas cm-all fa-times',
                        action: function (node) {
                            tabSQLTemplate(
                                'Delete Records',
                                node.tree.tag.delete
                                    .replace(
                                        '#table_name#',
                                        node.parent.parent
                                            .text + '.' +
                                        node.text));
                        }
                    }]
                }
            }, {
                text: 'Table Actions',
                icon: 'fas cm-all fa-list',
                submenu: {
                    elements: [{
                        text: 'Alter Table',
                        icon: 'fas cm-all fa-table',
                        action: function (node) {
                            startAlterTable(true,
                                'alter', node.text,
                                node.parent.parent.text
                            );
                        }
                    }, {
                        text: 'Alter Table (SQL)',
                        icon: 'fas cm-all fa-edit',
                        action: function (node) {
                            tabSQLTemplate('Alter Table', node.tree.tag
                                .alter_table.replace(
                                    '#table_name#', node.parent.parent.text
                                    + '.' + node.text));
                        }
                    }, {
                        text: 'Drop Table',
                        icon: 'fas cm-all fa-times',
                        action: function (node) {
                            tabSQLTemplate('Drop Table',
                                node.tree.tag.drop_table
                                    .replace(
                                        '#table_name#',
                                        node.parent.parent.text + '.' + node.text));
                        }
                    }]
                }
            }]
        },
        'cm_columns': {
            elements: [{
                text: 'Create Column',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Field', node.tree.tag
                        .create_column.replace(
                            '#table_name#', node.parent.parent.parent.text + '.' + node.parent
                                .text));
                }
            }]
        },
        'cm_column': {
            elements: [{
                text: 'Alter Column',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Alter Column', node.tree.tag
                        .alter_column.replace(
                            '#table_name#', node.parent.parent.parent.parent.text + '.' +
                        node.parent.parent.text).replace(
                            /#column_name#/g, node.text));
                }
            }, {
                text: 'Drop Column',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Column', node.tree.tag
                        .drop_column.replace('#table_name#',
                            node.parent.parent.parent.parent.text + '.' + node.parent.parent
                                .text).replace(/#column_name#/g,
                                    node.text));
                }
            }]
        },
        'cm_pks': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Primary Key',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Primary Key', node.tree
                        .tag.create_primarykey.replace(
                            '#table_name#', node.parent.parent.parent.text + '.' + node.parent
                                .text));
                }
            }]
        },
        'cm_pk': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Drop Primary Key',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Primary Key', node.tree
                        .tag.drop_primarykey.replace(
                            '#table_name#', node.parent.parent.parent.parent.text + '.' +
                        node.parent.parent.text).replace(
                            '#constraint_name#', node.text)
                    );
                }
            }]
        },
        'cm_fks': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Foreign Key',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Foreign Key', node.tree
                        .tag.create_foreignkey.replace(
                            '#table_name#', node.parent.parent.parent.text + '.' + node.parent
                                .text));
                }
            }]
        },
        'cm_fk': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Drop Foreign Key',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Foreign Key', node.tree
                        .tag.drop_foreignkey.replace(
                            '#table_name#', node.parent.parent.parent.parent.text + '.' +
                        node.parent.parent.text).replace(
                            '#constraint_name#', node.text)
                    );
                }
            }]
        },
        'cm_uniques': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Unique',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Unique', node.tree.tag
                        .create_unique.replace(
                            '#table_name#', node.parent.parent.parent.text + '.' + node.parent
                                .text));
                }
            }]
        },
        'cm_unique': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Drop Unique',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Unique', node.tree.tag
                        .drop_unique.replace('#table_name#',
                            node.parent.parent.parent.parent.text + '.' + node.parent.parent
                                .text).replace(
                                    '#constraint_name#', node.text)
                    );
                }
            }]
        },
        'cm_indexes': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Index',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Index', node.tree.tag
                        .create_index.replace(
                            '#table_name#', node.parent.parent.parent.text + '.' + node.parent
                                .text));
                }
            }/*, {
                text: 'Doc: Indexes',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Indexes',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/indexes.html');
                }
            }*/]
        },
        'cm_index': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Drop Index',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Index', node.tree.tag.drop_index
                        .replace('#index_name#', node.parent.parent.parent.parent.text + '.' + node.text.replace(
                            ' (Unique)', '').replace(
                                ' (Non Unique)', '')));
                }
            }]
        },
        'cm_views': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create View',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create View', node.tree.tag
                        .create_view.replace(
                            '#schema_name#', node.parent.text
                        ));
                }
            }/*, {
                text: 'Doc: Views',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Views',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/sql-createview.html');
                }
            }*/]
        },
        'cm_view': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Query Data',
                icon: 'fas cm-all fa-search',
                action: function (node) {

                    var v_table_name = '';
                    v_table_name = node.parent.parent.text + '.' + node.text;

                    v_connTabControl.tag.createQueryTab(
                        node.text);

                    v_connTabControl.selectedTab.tag.tabControl
                        .selectedTab.tag.editor.setValue(
                            '-- Querying Data\nselect t.*\nfrom ' +
                            v_table_name + ' t');
                    v_connTabControl.selectedTab.tag.tabControl
                        .selectedTab.tag.editor.clearSelection();
                    renameTabConfirm(v_connTabControl.selectedTab
                        .tag.tabControl.selectedTab, node.text
                    );

                    //minimizeEditor();

                    querySQL(0);
                }
            }, {
                text: 'Edit View',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    v_connTabControl.tag.createQueryTab(
                        node.text);
                    getViewDefinitionMysql(node);
                }
            }, {
                text: 'Drop View',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop View', node.tree.tag.drop_view
                        .replace('#view_name#', node.parent.parent.text + '.' + node.text)
                    );
                }
            }]
        },
        /*'cm_triggers': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                },
            }, {
                text: 'Create Trigger',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate('Create Trigger', node.tree.tag
                        .create_trigger.replace(
                            '#table_name#', node.tree.tag.v_database + '.' + node.parent
                            .text));
                }
            }, {
                text: 'Doc: Triggers',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Triggers',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/trigger-definition.html');
                }
            }]
        },
        'cm_view_triggers': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                },
            }, {
                text: 'Create Trigger',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate('Create Trigger', node.tree.tag
                        .create_view_trigger.replace(
                            '#table_name#', node.tree.tag.v_database + '.' + node.parent
                            .text));
                }
            }, {
                text: 'Doc: Triggers',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Triggers',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/trigger-definition.html');
                }
            }]
        },
        'cm_trigger': {
            elements: [{
                text: 'Alter Trigger',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate('Alter Trigger', node.tree.tag
                        .alter_trigger.replace(
                            '#table_name#', node.tree.tag.v_database + '.' +
                            node.parent.parent.text).replace(
                            '#trigger_name#', node.text));
                }
            }, {
                text: 'Enable Trigger',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate('Enable Trigger', node.tree.tag
                        .enable_trigger.replace(
                            '#table_name#', node.tree.tag.v_database + '.' +
                            node.parent.parent.text).replace(
                            '#trigger_name#', node.text));
                }
            }, {
                text: 'Disable Trigger',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate('Disable Trigger', node.tree
                        .tag.disable_trigger.replace(
                            '#table_name#', node.tree.tag.v_database + '.' +
                            node.parent.parent.text).replace(
                            '#trigger_name#', node.text));
                }
            }, {
                text: 'Drop Trigger',
                icon: 'fas cm-all fa-times',
                action: function(node) {
                    tabSQLTemplate('Drop Trigger', node.tree.tag
                        .drop_trigger.replace(
                            '#table_name#', node.tree.tag.v_database + '.' +
                            node.parent.parent.text).replace(
                            '#trigger_name#', node.text));
                }
            }]
        },
        'cm_partitions': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Partition',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate('Create Partition', node.tree
                        .tag.create_partition.replace(
                            '#table_name#', node.tree.tag.v_database + '.' + node.parent
                            .text));
                }
            }, {
                text: 'Doc: Partitions',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Partitions',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/ddl-partitioning.html');
                }
            }]
        },
        'cm_partition': {
            elements: [{
                text: 'No Inherit Partition',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate('No Inherit Partition', node
                        .tree.tag.noinherit_partition.replace(
                            '#table_name#', node.tree.tag.v_database + '.' +
                            node.parent.parent.text).replace(
                            '#partition_name#', node.text));
                }
            }, {
                text: 'Drop Partition',
                icon: 'fas cm-all fa-times',
                action: function(node) {
                    tabSQLTemplate('Drop Partition', node.tree.tag
                        .drop_partition.replace(
                            '#partition_name#', node.text));
                }
            }]
        },*/
        'cm_functions': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Function',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Function', node.tree
                        .tag.create_function.replace(
                            '#schema_name#', node.parent.text
                        ));
                }
            }/*, {
                text: 'Doc: Functions',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Functions',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/sql-createfunction.html');
                }
            }*/]
        },
        'cm_function': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Edit Function',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    v_connTabControl.tag.createQueryTab(
                        node.text);
                    getFunctionDefinitionMysql(node);
                }
            }, {
                text: 'Drop Function',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Function', node.tree.tag
                        .drop_function.replace(
                            '#function_name#', node.tag.id)
                    );
                }
            }]
        },
        'cm_procedures': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Procedure',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    tabSQLTemplate('Create Procedure', node.tree
                        .tag.create_procedure.replace(
                            '#schema_name#', node.parent.text
                        ));
                }
            }/*, {
                text: 'Doc: Procedures',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: Functions',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/sql-createfunction.html');
                }
            }*/]
        },
        'cm_procedure': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Edit Procedure',
                icon: 'fas cm-all fa-edit',
                action: function (node) {
                    v_connTabControl.tag.createQueryTab(
                        node.text);
                    getProcedureDefinitionMysql(node);
                }
            }, {
                text: 'Drop Procedure',
                icon: 'fas cm-all fa-times',
                action: function (node) {
                    tabSQLTemplate('Drop Procedure', node.tree.tag
                        .drop_procedure.replace(
                            '#function_name#', node.tag.id)
                    );
                }
            }]
        },
        'cm_refresh': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        }
    };
    var tree = createTree(p_div, '#fcfdfd', context_menu);
    v_connTabControl.selectedTab.tag.tree = tree;
    //v_connTabControl.selectedTab.tag.divDetails.innerHTML = 'Active database: <b>' + v_connTabControl.selectedTab.tag.selectedDatabase + '</b>';

    tree.nodeAfterOpenEvent = function (node) {
        refreshTreeMysql(node);

    }

    tree.clickNodeEvent = function (node) {
        getPropertiesMysql(node);
    }

    tree.beforeContextMenuEvent = function (node, callback) {

        var v_elements = [];
        //Hooks
        if (v_connTabControl.tag.hooks.mysqlTreeContextMenu.length > 0) {
            for (var i = 0; i < v_connTabControl.tag.hooks.mysqlTreeContextMenu.length; i++)
                v_elements = v_elements.concat(v_connTabControl.tag.hooks.mysqlTreeContextMenu[i](node));
        }

        var v_customCallback = function () {
            callback(v_elements);
        }
        v_customCallback();
    }

    var node_server = tree.createNode('MySQL', false,
        'node-mysql', null, {
        type: 'server'
    }, 'cm_server');
    node_server.createChildNode('', true, 'node-spin',
        null, null);
    tree.drawTree();


}


function checkCurrentDatabaseMysql(p_node, p_complete_check, p_callback_continue, p_callback_stop) {
    // 检查节点是否有 database 标签，且与当前选中的数据库不一致
    if ((p_node.tag != null && p_node.tag.database != null && p_node.tag.database !=
        v_connTabControl.selectedTab.tag.selectedDatabase) && (
            p_complete_check || (!p_complete_check && p_node.tag.type !=
                'database'))) {

        showConfirm3(
            'This node belongs to another database, change active database to <b>' +
            p_node.tag.database + '</b>?',
            function () {
                // 用户点击“是”
                checkBeforeChangeDatabase(
                    function () {
                        if (p_callback_stop)
                            p_callback_stop();
                    },
                    function () {
                        // 调用后端接口切换数据库
                        // 注意：这里复用 OmniDB 通用的 change_active_database 接口
                        execAjax('/change_active_database/',
                            JSON.stringify({
                                "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
                                "p_tab_id": v_connTabControl.selectedTab.id,
                                "p_database": p_node.tag.database
                            }),
                            function (p_return) {
                                // 更新 UI 显示
                                v_connTabControl.selectedTab.tag.divDetails.innerHTML =
                                    'Active database: <b>' + p_node.tag.database + '</b>';

                                if (v_connTabControl.selectedTab.tag.selectedDatabaseNode) {
                                    v_connTabControl.selectedTab.tag.selectedDatabaseNode.clearNodeBold();
                                }

                                // 寻找并在树中高亮新的数据库节点
                                var v_list_database_nodes = p_node.tree.childNodes[0].childNodes[0].childNodes;
                                for (var i = 0; i < v_list_database_nodes.length; i++) {
                                    if (p_node.tag.database == v_list_database_nodes[i].text.replace(/"/g, '')) {
                                        v_list_database_nodes[i].setNodeBold();
                                        v_connTabControl.selectedTab.tag.selectedDatabase = p_node.tag.database;
                                        v_connTabControl.selectedTab.tag.selectedDatabaseNode = v_list_database_nodes[i];

                                        // 更新 Tab 标题
                                        if (v_connTabControl.selectedTab.tag.selectedTitle != '')
                                            v_connTabControl.selectedTab.tag.tabTitle.innerHTML =
                                                '<img src="' + v_url_folder + '/static/OmniDB_app/images/' + v_connTabControl.selectedTab.tag.selectedDBMS + '_medium.png"/> ' +
                                                v_connTabControl.selectedTab.tag.selectedTitle + ' - ' + v_connTabControl.selectedTab.tag.selectedDatabase;
                                        else
                                            v_connTabControl.selectedTab.tag.tabTitle.innerHTML =
                                                '<img src="' + v_url_folder + '/static/OmniDB_app/images/' + v_connTabControl.selectedTab.tag.selectedDBMS + '_medium.png"/> ' +
                                                v_connTabControl.selectedTab.tag.selectedDatabase;
                                    }
                                }
                                // 切换成功后，继续执行原本的操作（如展开节点）
                                if (p_callback_continue)
                                    p_callback_continue();
                            },
                            function (p_return) {
                                nodeOpenError(p_return, p_node);
                            },
                            'box');
                    })
            },
            function () {
                // 用户点击“否”
                if (p_callback_stop)
                    p_callback_stop();
            });

    } else {
        // 数据库一致，无需切换，直接继续
        p_callback_continue();
    }
}

/// <summary>
/// Retrieving properties.
/// </summary>
/// <param name="node">Node object.</param>
// function getPropertiesMysql(node) {
//     if (node.tag != undefined)
//         if (node.tag.type == 'table') {
//         getProperties('/get_properties_mysql/',
//           {
//             p_schema: node.parent.parent.text,
//             p_table: null,
//             p_object: node.text,
//             p_type: node.tag.type
//           });
//       } else if (node.tag.type == 'view') {
//         getProperties('/get_properties_mysql/',
//           {
//             p_schema: node.parent.parent.text,
//             p_table: null,
//             p_object: node.text,
//             p_type: node.tag.type
//           });
//       } else if (node.tag.type == 'function') {
//         getProperties('/get_properties_mysql/',
//           {
//             p_schema: node.parent.parent.text,
//             p_table: null,
//             p_object: node.text,
//             p_type: node.tag.type
//           });
//       } else if (node.tag.type == 'procedure') {
//         getProperties('/get_properties_mysql/',
//           {
//             p_schema: node.parent.parent.text,
//             p_table: null,
//             p_object: node.text,
//             p_type: node.tag.type
//           });
//       } else {
//         clearProperties();
//       }

//       //Hooks
//       if (v_connTabControl.tag.hooks.mysqlTreeNodeClick.length>0) {
//         for (var i=0; i<v_connTabControl.tag.hooks.mysqlTreeNodeClick.length; i++)
//           v_connTabControl.tag.hooks.mysqlTreeNodeClick[i](node);
//       }
// }

/// <summary>
/// Retrieving properties (Entry Point).
/// </summary>
function getPropertiesMysql(node) {
    checkCurrentDatabaseMysql(node, false, function () {
        getPropertiesMysqlConfirm(node);
    });
}

/// <summary>
/// Retrieving properties confirm (Actual Logic).
/// </summary>
function getPropertiesMysqlConfirm(node) {
    if (node.tag != undefined)
        if (node.tag.type == 'table') {
            getProperties('/get_properties_mysql/',
                {
                    p_schema: node.parent.parent.text,
                    p_table: null,
                    p_object: node.text,
                    p_type: node.tag.type
                });
        } else if (node.tag.type == 'view') {
            getProperties('/get_properties_mysql/',
                {
                    p_schema: node.parent.parent.text,
                    p_table: null,
                    p_object: node.text,
                    p_type: node.tag.type
                });
        } else if (node.tag.type == 'function') {
            getProperties('/get_properties_mysql/',
                {
                    p_schema: node.parent.parent.text,
                    p_table: null,
                    p_object: node.text,
                    p_type: node.tag.type
                });
        } else if (node.tag.type == 'procedure') {
            getProperties('/get_properties_mysql/',
                {
                    p_schema: node.parent.parent.text,
                    p_table: null,
                    p_object: node.text,
                    p_type: node.tag.type
                });
        } else {
            clearProperties();
        }

    //Hooks
    if (v_connTabControl.tag.hooks.mysqlTreeNodeClick.length > 0) {
        for (var i = 0; i < v_connTabControl.tag.hooks.mysqlTreeNodeClick.length; i++)
            v_connTabControl.tag.hooks.mysqlTreeNodeClick[i](node);
    }
}

/// <summary>
/// Refreshing tree node.
/// </summary>
/// <param name="node">Node object.</param>
// function refreshTreeMysql(node) {
//     if (node.tag != undefined)
//         if (node.tag.type == 'table_list') {
//             getTablesMysql(node);
//     } else if (node.tag.type == 'table') {
//         getColumnsMysql(node);
//     } else if (node.tag.type == 'primary_key') {
//         getPKMysql(node);
//     } else if (node.tag.type == 'pk') {
//         getPKColumnsMysql(node);
//     } else if (node.tag.type == 'uniques') {
//         getUniquesMysql(node);
//     } else if (node.tag.type == 'unique') {
//         getUniquesColumnsMysql(node);
//     } else if (node.tag.type == 'foreign_keys') {
//         getFKsMysql(node);
//     } else if (node.tag.type == 'foreign_key') {
//         getFKsColumnsMysql(node);
//     } else if (node.tag.type == 'view_list') {
//         getViewsMysql(node);
//     } else if (node.tag.type == 'view') {
//         getViewsColumnsMysql(node);
//     } else if (node.tag.type == 'indexes') {
//         getIndexesMysql(node);
//     } else if (node.tag.type == 'index') {
//         getIndexesColumnsMysql(node);
//     } else if (node.tag.type == 'function_list') {
//         getFunctionsMysql(node);
//     } else if (node.tag.type == 'function') {
//         getFunctionFieldsMysql(node);
//     } else if (node.tag.type == 'procedure_list') {
//         getProceduresMysql(node);
//     } else if (node.tag.type == 'procedure') {
//         getProcedureFieldsMysql(node);
//     } else if (node.tag.type == 'database_list') {
//         getDatabasesMysql(node);
//     } else if (node.tag.type == 'database') {
//         getDatabaseObjectsMysql(node);
//     } else if (node.tag.type == 'role_list') {
//         getRolesMysql(node);
//     } /*else if (node.tag.type == 'trigger_list') {
//         getTriggersMysql(node);
//     } else if (node.tag.type == 'triggerfunction_list') {
//         getTriggerFunctionsMysql(node);
//     } else if (node.tag.type == 'partition_list') {
//         getPartitionsMysql(node);
//     } */else if (node.tag.type == 'server') {
//         getTreeDetailsMysql(node);
//     }
//     else {
//       afterNodeOpenedCallbackMysql(node);
//     }
// }

/// <summary>
/// Refreshing tree node (Entry Point).
/// </summary>
function refreshTreeMysql(node) {
    // 拦截展开操作，检查数据库
    checkCurrentDatabaseMysql(node, true, function () {
        refreshTreeMysqlConfirm(node);
    }, function () {
        node.collapseNode();
    })
}

/// <summary>
/// Refreshing tree node confirm (Actual Logic).
/// </summary>
function refreshTreeMysqlConfirm(node) {
    if (node.tag != undefined)
        if (node.tag.type == 'table_list') {
            getTablesMysql(node);
        } else if (node.tag.type == 'table') {
            getColumnsMysql(node);
        } else if (node.tag.type == 'primary_key') {
            getPKMysql(node);
        } else if (node.tag.type == 'pk') {
            getPKColumnsMysql(node);
        } else if (node.tag.type == 'uniques') {
            getUniquesMysql(node);
        } else if (node.tag.type == 'unique') {
            getUniquesColumnsMysql(node);
        } else if (node.tag.type == 'foreign_keys') {
            getFKsMysql(node);
        } else if (node.tag.type == 'foreign_key') {
            getFKsColumnsMysql(node);
        } else if (node.tag.type == 'view_list') {
            getViewsMysql(node);
        } else if (node.tag.type == 'view') {
            getViewsColumnsMysql(node);
        } else if (node.tag.type == 'indexes') {
            getIndexesMysql(node);
        } else if (node.tag.type == 'index') {
            getIndexesColumnsMysql(node);
        } else if (node.tag.type == 'function_list') {
            getFunctionsMysql(node);
        } else if (node.tag.type == 'function') {
            getFunctionFieldsMysql(node);
        } else if (node.tag.type == 'procedure_list') {
            getProceduresMysql(node);
        } else if (node.tag.type == 'procedure') {
            getProcedureFieldsMysql(node);
        } else if (node.tag.type == 'database_list') {
            getDatabasesMysql(node);
        } else if (node.tag.type == 'database') {
            getDatabaseObjectsMysql(node);
        } else if (node.tag.type == 'role_list') {
            getRolesMysql(node);
        } else if (node.tag.type == 'server') {
            getTreeDetailsMysql(node);
        }
        else {
            afterNodeOpenedCallbackMysql(node);
        }
}

function afterNodeOpenedCallbackMysql(node) {
    //Hooks
    if (v_connTabControl.tag.hooks.mysqlTreeNodeOpen.length > 0) {
        for (var i = 0; i < v_connTabControl.tag.hooks.mysqlTreeNodeOpen.length; i++)
            v_connTabControl.tag.hooks.mysqlTreeNodeOpen[i](node);
    }
}

/// <summary>
/// Retrieving tree details.
/// </summary>
/// <param name="node">Node object.</param>
function getTreeDetailsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_tree_info_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
        }),
        function (p_return) {

            node.tree.contextMenu.cm_server.elements = []
            node.tree.contextMenu.cm_server.elements.push({
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function (node) {
                    if (node.childNodes == 0)
                        refreshTreeMysql(node);
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            });

            /*node.tree.contextMenu.cm_server.elements.push({
                text: 'Doc: PostgreSQL',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: PostgreSQL',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/');
                }
            });
            node.tree.contextMenu.cm_server.elements.push({
                text: 'Doc: SQL Language',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: SQL Language',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/sql.html');
                }
            });
            node.tree.contextMenu.cm_server.elements.push({
                text: 'Doc: SQL Commands',
                icon: 'fas cm-all fa-globe-americas',
                action: function(node) {
                    v_connTabControl.tag.createWebsiteTab(
                        'Documentation: SQL Commands',
                        'https://www.postgresql.org/docs/' +
                        getMajorVersionMysql(node.tree.tag.version) +
                        '/static/sql-commands.html');
                }
            });*/

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.tree.tag = {
                v_database: p_return.v_data.v_database_return.v_database,
                version: p_return.v_data.v_database_return.version,
                v_username: p_return.v_data.v_database_return.v_username,
                superuser: p_return.v_data.v_database_return.superuser,
                create_role: p_return.v_data.v_database_return.create_role,
                alter_role: p_return.v_data.v_database_return.alter_role,
                drop_role: p_return.v_data.v_database_return.drop_role,
                create_database: p_return.v_data.v_database_return.create_database,
                alter_database: p_return.v_data.v_database_return.alter_database,
                drop_database: p_return.v_data.v_database_return.drop_database,
                create_function: p_return.v_data.v_database_return.create_function,
                drop_function: p_return.v_data.v_database_return.drop_function,
                create_procedure: p_return.v_data.v_database_return.create_procedure,
                drop_procedure: p_return.v_data.v_database_return.drop_procedure,
                //create_triggerfunction: p_return.v_data.v_database_return
                //    .create_triggerfunction,
                //drop_triggerfunction: p_return.v_data.v_database_return
                //    .drop_triggerfunction,
                create_view: p_return.v_data.v_database_return.create_view,
                drop_view: p_return.v_data.v_database_return.drop_view,
                create_table: p_return.v_data.v_database_return.create_table,
                alter_table: p_return.v_data.v_database_return.alter_table,
                drop_table: p_return.v_data.v_database_return.drop_table,
                create_column: p_return.v_data.v_database_return.create_column,
                alter_column: p_return.v_data.v_database_return.alter_column,
                drop_column: p_return.v_data.v_database_return.drop_column,
                create_primarykey: p_return.v_data.v_database_return.create_primarykey,
                drop_primarykey: p_return.v_data.v_database_return.drop_primarykey,
                create_unique: p_return.v_data.v_database_return.create_unique,
                drop_unique: p_return.v_data.v_database_return.drop_unique,
                create_foreignkey: p_return.v_data.v_database_return.create_foreignkey,
                drop_foreignkey: p_return.v_data.v_database_return.drop_foreignkey,
                create_index: p_return.v_data.v_database_return.create_index,
                drop_index: p_return.v_data.v_database_return.drop_index,
                //create_trigger: p_return.v_data.v_database_return.create_trigger,
                //create_view_trigger: p_return.v_data.v_database_return.create_view_trigger,
                //alter_trigger: p_return.v_data.v_database_return.alter_trigger,
                //enable_trigger: p_return.v_data.v_database_return.enable_trigger,
                //disable_trigger: p_return.v_data.v_database_return.disable_trigger,
                //drop_trigger: p_return.v_data.v_database_return.drop_trigger,
                //create_partition: p_return.v_data.v_database_return.create_partition,
                //noinherit_partition: p_return.v_data.v_database_return.noinherit_partition,
                //drop_partition: p_return.v_data.v_database_return.drop_partition
                delete: p_return.v_data.v_database_return.delete
            }

            node.tree.contextMenu.cm_server.elements.push({
                text: 'Monitoring',
                icon: 'fas cm-all fa-chart-line',
                action: function (node) { },
                submenu: {
                    elements: [/*{
                        text: 'Dashboard',
                        icon: 'fas cm-all fa-chart-line',
                        action: function(node) {
                            v_connTabControl.tag.createMonitorDashboardTab();
                            startMonitorDashboard();
                        }
                    }, */{
                            text: 'Process List',
                            icon: 'fas cm-all fa-chart-line',
                            action: function (node) {
                                v_connTabControl.tag.createMonitoringTab(
                                    'Process List',
                                    'select * from information_schema.processlist', [{
                                        icon: 'fas cm-all fa-times',
                                        title: 'Terminate',
                                        action: 'mysqlTerminateBackend'
                                    }]);
                            }
                        }]
                }
            });

            node.setText(p_return.v_data.v_database_return.version);

            var node_databases = node.createChildNode('Databases', false,
                'fas node-all fa-database node-database-list', {
                type: 'database_list',
                num_databases: 0
            }, 'cm_databases');
            node_databases.createChildNode('', true,
                'node-spin', null, null);

            if (node.tree.tag.superuser) {
                var node_roles = node.createChildNode('Roles', false,
                    'fas node-all fa-users node-user-list', {
                    type: 'role_list',
                    num_roles: 0
                }, 'cm_roles');
                node_roles.createChildNode('', true,
                    'node-spin', null, null);
            }

            if (v_connTabControl.selectedTab.tag.firstTimeOpen) {
                v_connTabControl.selectedTab.tag.firstTimeOpen = false;
                //v_connTabControl.tag.createMonitorDashboardTab();
                //startMonitorDashboard();
            }

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);

}

/// <summary>
/// Retrieving database objects.
/// </summary>
/// <param name="node">Node object.</param>
/// <summary>
/// Retrieving databases.
/// </summary>
/// <param name="node">Node object.</param>
/// <summary>
/// Retrieving databases.
/// </summary>
/// <param name="node">Node object.</param>
/// <summary>
/// Retrieving databases.
/// </summary>
/// <param name="node">Node object.</param>
function getDatabasesMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null, null);

    execAjax('/get_databases_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.tag.num_databases = p_return.v_data.length;

            // 1. 获取当前OmniDB记录的已选数据库（可能是 null 或 ''）
            var currentDb = v_connTabControl.selectedTab.tag.selectedDatabase;

            for (i = 0; i < p_return.v_data.length; i++) {
                var dbName = p_return.v_data[i].v_name.replace(/"/g, '');

                // 2. 【关键】必须先创建节点，否则后面 v_node 会报错导致不显示
                var v_node = node.createChildNode(dbName,
                    false, 'fas node-all fa-database node-database', {
                    type: 'database',
                    database: dbName
                }, 'cm_database', null, false);

                // 3. 判断逻辑：如果当前是选中库，或者（没选中库 且 当前是 information_schema）
                if (currentDb === dbName || (!currentDb && dbName === 'information_schema')) {

                    v_node.setNodeBold();
                    v_connTabControl.selectedTab.tag.selectedDatabaseNode = v_node;

                    // 如果是因为“默认规则”而选中的，需要更新全局状态
                    if (!currentDb) {
                        v_connTabControl.selectedTab.tag.selectedDatabase = dbName;
                        // 更新 Tab 顶部的文字显示
                        if (v_connTabControl.selectedTab.tag.divDetails) {
                            v_connTabControl.selectedTab.tag.divDetails.innerHTML = 'Active database: <b>' + dbName + '</b>';
                        }
                    }
                } else {
                    v_node.clearNodeBold();
                }

                v_node.createChildNode('', true, 'node-spin', null, null, null, false);
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving database objects.
/// </summary>
/// <param name="node">Node object.</param>
function getDatabaseObjectsMysql(node) {

    node.removeChildNodes();

    // 1. Tables 节点
    var node_tables = node.createChildNode('Tables', false,
        'fas node-all fa-th node-table-list', {
        type: 'table_list',
        num_tables: 0,
        database: v_connTabControl.selectedTab.tag.selectedDatabase
    }, 'cm_tables');
    node_tables.createChildNode('', true,
        'node-spin', null, null);

    // 2. Views 节点
    var node_views = node.createChildNode('Views', false,
        'fas node-all fa-eye node-view-list', {
        type: 'view_list',
        num_views: 0,
        database: v_connTabControl.selectedTab.tag.selectedDatabase
    }, 'cm_views');
    node_views.createChildNode('', true,
        'node-spin', null, null);

    // 3. Functions 节点
    var node_functions = node.createChildNode('Functions',
        false, 'fas node-all fa-cog node-function-list', {
        type: 'function_list',
        num_functions: 0,
        database: v_connTabControl.selectedTab.tag.selectedDatabase
    }, 'cm_functions');
    node_functions.createChildNode('', true,
        'node-spin', null, null);

    // 4. Procedures 节点
    var node_procedures = node.createChildNode('Procedures',
        false, 'fas node-all fa-cog node-procedure-list', {
        type: 'procedure_list',
        num_functions: 0,
        database: v_connTabControl.selectedTab.tag.selectedDatabase
    }, 'cm_procedures');
    node_procedures.createChildNode('', true,
        'node-spin', null, null);

    // 刷新完成后的回调
    afterNodeOpenedCallbackMysql(node);
}

/// <summary>
/// Retrieving roles.
/// </summary>
/// <param name="node">Node object.</param>
function getRolesMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_roles_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.setText('Roles (' + p_return.v_data.length + ')');

            node.tag.num_tablespaces = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = node.createChildNode(p_return.v_data[i].v_name,
                    false, 'fas node-all fa-user node-user', {
                    type: 'role',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_role', null, false);

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving tables.
/// </summary>
/// <param name="node">Node object.</param>
function getTablesMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);


    execAjax('/get_tables_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_schema": node.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.setText('Tables (' + p_return.v_data.length + ')');

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = node.createChildNode(p_return.v_data[i].v_name,
                    false, 'fas node-all fa-table node-table', {
                    type: 'table',
                    has_primary_keys: p_return.v_data[i].v_has_primary_keys,
                    has_foreign_keys: p_return.v_data[i].v_has_foreign_keys,
                    has_uniques: p_return.v_data[i].v_has_uniques,
                    has_indexes: p_return.v_data[i].v_has_indexes,
                    has_checks: p_return.v_data[i].v_has_checks,
                    has_excludes: p_return.v_data[i].v_has_excludes,
                    has_rules: p_return.v_data[i].v_has_rules,
                    has_triggers: p_return.v_data[i].v_has_triggers,
                    has_partitions: p_return.v_data[i].v_has_partitions,
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_table', null, false);
                v_node.createChildNode('', false,
                    'node-spin', {
                    type: 'table_field',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, null, null, false);

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving views.
/// </summary>
/// <param name="node">Node object.</param>
function getViewsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_views_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_schema": node.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.setText('Views (' + p_return.v_data.length + ')');

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = node.createChildNode(p_return.v_data[i].v_name,
                    false, 'fas node-all fa-eye node-view', {
                    type: 'view',
                    has_triggers: p_return.v_data[i].v_has_triggers,
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_view', null, false);
                v_node.createChildNode('', false,
                    'node-spin', {
                    type: 'view_field',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, null, null, false);
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);
        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving View Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getViewsColumnsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_views_columns_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.text,
            "p_schema": node.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            v_list = node.createChildNode('Columns (' + p_return.v_data.length +
                ')', false, 'fas node-all fa-columns node-column', null,
                null, null, false);

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = v_list.createChildNode(p_return.v_data[i].v_column_name,
                    false, 'fas node-all fa-columns node-column', {
                    type: 'table_field',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, null, null, false);
                v_node.createChildNode('Type: ' + p_return.v_data[i].v_data_type,
                    false, 'fas node-all fa-ellipsis-h node-bullet',
                    null, null, null, false);

            }

            if (node.tag.has_rules) {
                v_node = node.createChildNode('Rules', false,
                    'fas node-all fa-lightbulb node-rule', {
                    type: 'rule_list',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_rules', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            if (node.tag.has_triggers) {
                v_node = node.createChildNode('Triggers', false,
                    'fas node-all fa-bolt node-trigger', {
                    type: 'trigger_list',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_view_triggers', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving view definition.
/// </summary>
/// <param name="node">Node object.</param>
function getViewDefinitionMysql(node) {

    execAjax('/get_view_definition_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_view": node.text,
            "p_schema": node.parent.parent.text
        }),
        function (p_return) {

            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .setValue(p_return.v_data);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .clearSelection();
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .gotoLine(0, 0, true);
            //v_connTabControl.selectedTab.tag.tabControl.selectedTab.renameTab(node.text);
            renameTabConfirm(v_connTabControl.selectedTab.tag.tabControl.selectedTab,
                node.text);

            var v_div_result = v_connTabControl.selectedTab.tag.tabControl.selectedTab
                .tag.div_result;

            if (v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                .ht != null) {
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht.destroy();
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht = null;
            }

            v_div_result.innerHTML = '';

            maximizeEditor();

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        true);

}

/// <summary>
/// Retrieving columns.
/// </summary>
/// <param name="node">Node object.</param>
function getColumnsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_columns_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.text,
            "p_schema": node.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            v_list = node.createChildNode('Columns (' + p_return.v_data.length +
                ')', false, 'fas node-all fa-columns node-column', {
                type: 'column_list',
                database: v_connTabControl.selectedTab.tag.selectedDatabase
            }, 'cm_columns', null, false);

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = v_list.createChildNode(p_return.v_data[i].v_column_name,
                    false, 'fas node-all fa-columns node-column', {
                    type: 'table_field',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_column', null, false);
                v_node.createChildNode('Type: ' + p_return.v_data[i].v_data_type,
                    false, 'fas node-all fa-ellipsis-h node-bullet',
                    null, null, null, false);
                v_node.createChildNode('Nullable: ' + p_return.v_data[i].v_nullable,
                    false, 'fas node-all fa-ellipsis-h node-bullet',
                    null, null, null, false);

            }

            if (node.tag.has_primary_keys) {
                v_node = node.createChildNode('Primary Key', false,
                    'fas node-all fa-key node-pkey', {
                    type: 'primary_key',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_pks', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            if (node.tag.has_foreign_keys) {
                v_node = node.createChildNode('Foreign Keys', false,
                    'fas node-all fa-key node-fkey', {
                    type: 'foreign_keys',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_fks', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            if (node.tag.has_uniques) {
                v_node = node.createChildNode('Uniques', false,
                    'fas node-all fa-key node-unique', {
                    type: 'uniques',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_uniques', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            if (node.tag.has_indexes) {
                v_node = node.createChildNode('Indexes', false,
                    'fas node-all fa-thumbtack node-index', {
                    type: 'indexes',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_indexes', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            if (node.tag.has_triggers) {
                v_node = node.createChildNode('Triggers', false,
                    'fas node-all fa-bolt node-trigger', {
                    type: 'trigger_list',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_triggers', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            if (node.tag.has_partitions) {
                v_node = node.createChildNode('Partitions', false,
                    'fas node-all fa-table node-partition', {
                    type: 'partition_list',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_partitions', null, false);
                v_node.createChildNode('', false,
                    'node-spin', null, null, null, false);
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving PKs.
/// </summary>
/// <param name="node">Node object.</param>
function getPKMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_pk_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.parent.text,
            "p_schema": node.parent.parent.parent.text
        }),
        function (p_return) {

            node.setText('Primary Key (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0) {
                node.removeChildNodes();
                //node.contextMenu = 'cm_refresh'
            } else {
                //node.contextMenu = 'cm_pks'
            }

            if (p_return.v_data.length > 0) {
                v_node = node.createChildNode(p_return.v_data[0][0], false,
                    'fas node-all fa-key node-pkey', {
                    type: 'pk',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_pk');
                v_node.createChildNode('', false,
                    'node-spin', {
                    type: 'pk_field',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, null);
            }

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving PKs Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getPKColumnsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_pk_columns_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_key": node.text,
            "p_table": node.parent.parent.text,
            "p_schema": node.parent.parent.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node.createChildNode(p_return.v_data[i][0], false,
                    'fas node-all fa-columns node-column', null, null, null, false);

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving Uniques.
/// </summary>
/// <param name="node">Node object.</param>
function getUniquesMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_uniques_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.parent.text,
            "p_schema": node.parent.parent.parent.text
        }),
        function (p_return) {

            node.setText('Uniques (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            if (p_return.v_data.length > 0) {

                for (i = 0; i < p_return.v_data.length; i++) {

                    v_node = node.createChildNode(p_return.v_data[i][0],
                        false,
                        'fas node-all fa-key node-unique', {
                        type: 'unique',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    }, 'cm_unique', null, false);

                    v_node.createChildNode('', false,
                        'node-spin', {
                        type: 'unique_field',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    }, null, null, false);

                }

                node.drawChildNodes();

            }

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving Uniques Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getUniquesColumnsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_uniques_columns_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_unique": node.text,
            "p_table": node.parent.parent.text,
            "p_schema": node.parent.parent.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            if (p_return.v_data.length > 0) {

                for (i = 0; i < p_return.v_data.length; i++) {

                    v_node.createChildNode(p_return.v_data[i][0], false,
                        'fas node-all fa-columns node-column', null, null, null, false
                    );

                }

                node.drawChildNodes();

            }

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving Indexes.
/// </summary>
/// <param name="node">Node object.</param>
function getIndexesMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_indexes_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.parent.text,
            "p_schema": node.parent.parent.parent.text
        }),
        function (p_return) {

            node.setText('Indexes (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            var v_node;

            if (p_return.v_data.length > 0) {

                for (i = 0; i < p_return.v_data.length; i++) {

                    v_node = node.createChildNode(p_return.v_data[i][0] +
                        ' (' + p_return.v_data[i][1] + ')', false,
                        'fas node-all fa-thumbtack node-index', {
                        type: 'index',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    }, 'cm_index', null, false);

                    v_node.createChildNode('', false,
                        'node-spin', {
                        type: 'index_field'
                    }, null, null, false);

                }

                node.drawChildNodes();

            }

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving Indexes Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getIndexesColumnsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_indexes_columns_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_index": node.text.replace(' (Non Unique)', '').replace(
                ' (Unique)', ''),
            "p_table": node.parent.parent.text,
            "p_schema": node.parent.parent.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            if (p_return.v_data.length > 0) {

                for (i = 0; i < p_return.v_data.length; i++) {

                    node.createChildNode(p_return.v_data[i][0], false,
                        'fas node-all fa-columns node-column', null, null, null, false
                    );

                }

                node.drawChildNodes();

            }

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving FKs.
/// </summary>
/// <param name="node">Node object.</param>
function getFKsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_fks_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.parent.text,
            "p_schema": node.parent.parent.parent.text
        }),
        function (p_return) {

            node.setText('Foreign Keys (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = node.createChildNode(p_return.v_data[i][0],
                    false,
                    'fas node-all fa-key node-fkey', {
                    type: 'foreign_key',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_fk', null, false);
                v_node.createChildNode('Referenced Table: ' + p_return.v_data[
                    i][1], false,
                    'fas node-all fa-table node-table', null,
                    null, null, false);
                v_node.createChildNode('Delete Rule: ' + p_return.v_data[
                    i][2], false,
                    'fas node-all fa-ellipsis-h node-bullet',
                    null, null, null, false);
                v_node.createChildNode('Update Rule: ' + p_return.v_data[
                    i][3], false,
                    'fas node-all fa-ellipsis-h node-bullet',
                    null, null, null, false);

                v_curr_fk = p_return.v_data[i][0];

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving FKs Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getFKsColumnsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_fks_columns_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_fkey": node.text,
            "p_table": node.parent.parent.text,
            "p_schema": node.parent.parent.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.createChildNode('Referenced Table: ' + p_return.v_data[
                0][0], false,
                'fas node-all fa-table node-table', null,
                null, null, false);
            node.createChildNode('Delete Rule: ' + p_return.v_data[
                0][1], false,
                'fas node-all fa-ellipsis-h node-bullet',
                null, null, null, false);
            node.createChildNode('Update Rule: ' + p_return.v_data[
                0][2], false,
                'fas node-all fa-ellipsis-h node-bullet',
                null, null, null, false);

            for (i = 0; i < p_return.v_data.length; i++) {

                node.createChildNode(p_return.v_data[i][3] +
                    " <i class='fas node-all fa-arrow-right'></i> " +
                    p_return.v_data[i][4], false,
                    'fas node-all fa-columns node-column', null, null, null, false);

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/*
/// <summary>
/// Retrieving Triggers.
/// </summary>
/// <param name="node">Node object.</param>
function getTriggersMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_triggers_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.parent.text,
            "p_schema": null
        }),
        function(p_return) {

            node.setText('Triggers (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            var v_node;

            if (p_return.v_data.length > 0) {

                for (i = 0; i < p_return.v_data.length; i++) {

                    v_node = node.createChildNode(p_return.v_data[i][0],
                        false, '/static/OmniDB_app/images/trigger.png', {
                            type: 'trigger',
                            database: v_connTabControl.selectedTab.tag.selectedDatabase
                        }, 'cm_trigger');
                    v_node.createChildNode('Enabled: ' + p_return.v_data[i]
                        [1], false,
                        'fas node-all fa-ellipsis-h node-bullet',
                        null, null);
                    v_node.createChildNode('Function: ' + p_return.v_data[i]
                        [2], false,
                        'fas node-all fa-ellipsis-h node-bullet',
                        null, null);

                }

            }

        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving Partitions.
/// </summary>
/// <param name="node">Node object.</param>
function getPartitionsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_partitions_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": node.parent.text,
            "p_schema": null
        }),
        function(p_return) {

            node.setText('Partitions (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            var v_node;

            if (p_return.v_data.length > 0) {

                for (i = 0; i < p_return.v_data.length; i++) {

                    v_node = node.createChildNode(p_return.v_data[i][0],
                        false,
                        '/static/OmniDB_app/images/partition.png', {
                            type: 'partition',
                            database: v_connTabControl.selectedTab.tag.selectedDatabase
                        }, 'cm_partition');

                }

            }

        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}
*/

/// <summary>
/// Retrieving functions.
/// </summary>
/// <param name="node">Node object.</param>
function getFunctionsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);


    execAjax('/get_functions_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_schema": node.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.setText('Functions (' + p_return.v_data.length + ')');

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = node.createChildNode(p_return.v_data[i].v_name,
                    false, 'fas node-all fa-cog node-function', {
                    type: 'function',
                    id: p_return.v_data[i].v_id,
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_function', null, false);
                v_node.createChildNode('', false,
                    'node-spin', {
                    type: 'function_field'
                }, null, null, false);

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving function fields.
/// </summary>
/// <param name="node">Node object.</param>
function getFunctionFieldsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_function_fields_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_function": node.tag.id,
            "p_schema": node.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                if (p_return.v_data[i].v_type == 'O')
                    v_node = node.createChildNode(p_return.v_data[i].v_name,
                        false, 'fas node-all fa-arrow-right node-function-field', null,
                        null, null, false);
                else {
                    if (p_return.v_data[i].v_type == 'I')
                        v_node = node.createChildNode(p_return.v_data[i].v_name,
                            false, 'fas node-all fa-arrow-left node-function-field',
                            null, null, null, false);
                    else
                        v_node = node.createChildNode(p_return.v_data[i].v_name,
                            false,
                            'fas node-all fa-exchange-alt node-function-field',
                            null, null, null, false);
                }

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving function definition.
/// </summary>
/// <param name="node">Node object.</param>
/*function getDebugFunctionDefinitionMysql(node) {

    execAjax('/get_function_debug_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_function": node.tag.id
        }),
        function(p_return) {

            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .setValue(p_return.v_data);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .clearSelection();
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .gotoLine(0, 0, true);

        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        true);

}*/

/// <summary>
/// Retrieving function definition.
/// </summary>
/// <param name="node">Node object.</param>
function getFunctionDefinitionMysql(node) {

    execAjax('/get_function_definition_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_function": node.tag.id
        }),
        function (p_return) {

            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .setValue(p_return.v_data);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .clearSelection();
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .gotoLine(0, 0, true);
            //v_connTabControl.selectedTab.tag.tabControl.selectedTab.renameTab(node.text);
            renameTabConfirm(v_connTabControl.selectedTab.tag.tabControl.selectedTab,
                node.text);

            var v_div_result = v_connTabControl.selectedTab.tag.tabControl.selectedTab
                .tag.div_result;

            if (v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                .ht != null) {
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht.destroy();
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht = null;
            }

            v_div_result.innerHTML = '';

            maximizeEditor();

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        true);

}

/// <summary>
/// Retrieving procedures.
/// </summary>
/// <param name="node">Node object.</param>
function getProceduresMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);


    execAjax('/get_procedures_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_schema": node.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.setText('Procedures (' + p_return.v_data.length + ')');

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                v_node = node.createChildNode(p_return.v_data[i].v_name,
                    false, 'fas node-all fa-cog node-procedure', {
                    type: 'procedure',
                    id: p_return.v_data[i].v_id,
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, 'cm_procedure', null, false);
                v_node.createChildNode('', false,
                    'node-spin', {
                    type: 'procedure_field',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                }, null, null, false);

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving procedure fields.
/// </summary>
/// <param name="node">Node object.</param>
function getProcedureFieldsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_procedure_fields_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_procedure": node.tag.id,
            "p_schema": node.parent.parent.text
        }),
        function (p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                if (p_return.v_data[i].v_type == 'O')
                    v_node = node.createChildNode(p_return.v_data[i].v_name,
                        false, 'fas node-all fa-arrow-right node-function-field', null,
                        null, null, false);
                else {
                    if (p_return.v_data[i].v_type == 'I')
                        v_node = node.createChildNode(p_return.v_data[i].v_name,
                            false, 'fas node-all fa-arrow-left node-function-field',
                            null, null, null, false);
                    else
                        v_node = node.createChildNode(p_return.v_data[i].v_name,
                            false,
                            'fas node-all fa-exchange-alt node-function-field',
                            null, null, null, false);
                }

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackMysql(node);

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving procedure definition.
/// </summary>
/// <param name="node">Node object.</param>
/*function getDebugProcedureDefinitionMysql(node) {

    execAjax('/get_function_debug_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_function": node.tag.id
        }),
        function(p_return) {

            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .setValue(p_return.v_data);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .clearSelection();
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .gotoLine(0, 0, true);

        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        true);

}*/

/// <summary>
/// Retrieving procedure definition.
/// </summary>
/// <param name="node">Node object.</param>
function getProcedureDefinitionMysql(node) {

    execAjax('/get_procedure_definition_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_procedure": node.tag.id
        }),
        function (p_return) {

            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .setValue(p_return.v_data);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .clearSelection();
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .gotoLine(0, 0, true);
            //v_connTabControl.selectedTab.tag.tabControl.selectedTab.renameTab(node.text);
            renameTabConfirm(v_connTabControl.selectedTab.tag.tabControl.selectedTab,
                node.text);

            var v_div_result = v_connTabControl.selectedTab.tag.tabControl.selectedTab
                .tag.div_result;

            if (v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                .ht != null) {
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht.destroy();
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht = null;
            }

            v_div_result.innerHTML = '';

            maximizeEditor();

        },
        function (p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        true);

}

/*
/// <summary>
/// Retrieving trigger functions.
/// </summary>
/// <param name="node">Node object.</param>
function getTriggerFunctionsMysql(node) {

    node.removeChildNodes();
    node.createChildNode('', false, 'node-spin', null,
        null);

    execAjax('/get_triggerfunctions_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_schema": null
        }),
        function(p_return) {

            if (node.childNodes.length > 0)
                node.removeChildNodes();

            node.setText('Trigger Functions (' + p_return.v_data.length +
                ')');

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {

                node.createChildNode(p_return.v_data[i].v_name, false,
                    '/static/OmniDB_app/images/gear2.png', {
                        type: 'triggerfunction',
                        id: p_return.v_data[i].v_id,
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    }, 'cm_triggerfunction');

            }

        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false);
}

/// <summary>
/// Retrieving trigger function definition.
/// </summary>
/// <param name="node">Node object.</param>
function getTriggerFunctionDefinitionMysql(node) {

    execAjax('/get_triggerfunction_definition_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_function": node.tag.id
        }),
        function(p_return) {

            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .setValue(p_return.v_data);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .clearSelection();
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor
                .gotoLine(0, 0, true);
            //v_connTabControl.selectedTab.tag.tabControl.selectedTab.renameTab(node.text);
            renameTabConfirm(v_connTabControl.selectedTab.tag.tabControl.selectedTab,
                node.text);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.sel_filtered_data
                .value = 1;

            var v_div_result = v_connTabControl.selectedTab.tag.tabControl.selectedTab
                .tag.div_result;

            if (v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                .ht != null) {
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht.destroy();
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag
                    .ht = null;
            }

            v_div_result.innerHTML = '';

            maximizeEditor();

        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        true);

}
*/

/// <summary>
/// Retrieving SELECT SQL template.
/// </summary>
function TemplateSelectMysql(p_schema, p_table) {

    execAjax('/template_select_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": p_table,
            "p_schema": p_schema
        }),
        function (p_return) {
            v_connTabControl.tag.createQueryTab(
                p_schema + '.' + p_table);


            v_connTabControl.selectedTab
                .tag.tabControl.selectedTab
                .tag.editor.setValue(p_return.v_data.v_template);
            v_connTabControl.selectedTab
                .tag.tabControl.selectedTab
                .tag.editor.clearSelection();
            renameTabConfirm(
                v_connTabControl.selectedTab
                    .tag.tabControl.selectedTab,
                p_schema + '.' + p_table);

            //minimizeEditor();

            querySQL(0);
        },
        function (p_return) {
            showError(p_return.v_data);
            return '';
        },
        'box',
        true);
}

/// <summary>
/// Retrieving INSERT SQL template.
/// </summary>
function TemplateInsertMysql(p_schema, p_table) {

    execAjax('/template_insert_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": p_table,
            "p_schema": p_schema
        }),
        function (p_return) {
            tabSQLTemplate(
                'Insert ' + p_schema + '.' + p_table,
                p_return.v_data.v_template);
        },
        function (p_return) {
            showError(p_return.v_data);
            return '';
        },
        'box',
        true);
}

/// <summary>
/// Retrieving UPDATE SQL template.
/// </summary>
function TemplateUpdateMysql(p_schema, p_table) {

    execAjax('/template_update_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_table": p_table,
            "p_schema": p_schema
        }),
        function (p_return) {
            tabSQLTemplate(
                'Update ' + p_schema + '.' + p_table,
                p_return.v_data.v_template);
        },
        function (p_return) {
            showError(p_return.v_data);
            return '';
        },
        'box',
        true);
}

function nodeOpenError(p_return, p_node) {

    if (p_return.v_data.password_timeout) {
        p_node.collapseNode();
        showPasswordPrompt(
            v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            function () {
                p_node.expandNode();
            },
            null,
            p_return.v_data.message
        );
    } else {

        if (p_node.childNodes.length > 0)
            p_node.removeChildNodes();

        v_node = p_node.createChildNode(
            "Error - <a class='a_link' onclick='showError(&quot;" +
            p_return.v_data.replace(/\n/g, "<br/>").replace(/"/g, '') +
            "&quot;)'>View Detail</a>", false,
            'fas fa-times node-error', {
            type: 'error',
            message: p_return.v_data
        }, null);
    }

}

/*function getMajorVersionMysql(p_version) {
    var v_version = p_version.split(' (')[0]
    var tmp = v_version.replace('PostgreSQL ', '').replace('beta', '.').split(
        '.')
    tmp.pop()
    return tmp.join('.')
}*/

function mysqlTerminateBackendConfirm(p_pid) {
    execAjax('/kill_backend_mysql/',
        JSON.stringify({
            "p_database_index": v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            "p_tab_id": v_connTabControl.selectedTab.id,
            "p_pid": p_pid
        }),
        function (p_return) {

            refreshMonitoring();

        },
        function (p_return) {
            if (p_return.v_data.password_timeout) {
                showPasswordPrompt(
                    v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
                    function () {
                        mysqlTerminateBackendConfirm(p_pid);
                    },
                    null,
                    p_return.v_data.message
                );
            } else {
                showError(p_return.v_data);
            }
        },
        'box',
        true);

}

function mysqlTerminateBackend(p_row) {

    showConfirm('Are you sure you want to terminate process ' + p_row[0] + '?',
        function () {

            mysqlTerminateBackendConfirm(p_row[0]);

        });

}

/// <summary>
/// Retrieving Explain for MySQL.
/// </summary>
function getExplainMysql(p_mode) {
    var v_editor = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor;
    var v_query = v_editor.getSelectedText();
    if (v_query.trim() == '') v_query = v_editor.getValue();
    if (v_query.trim() == '') { showAlert('Please provide a string.'); return; }

    if (p_mode == 0) {
        v_query = 'EXPLAIN FORMAT=TREE ' + v_query; 
    }
    else if (p_mode == 1) {
        v_query = 'EXPLAIN ANALYZE ' + v_query; 
    }

    querySQL(0, true, v_query, getExplainReturnMysql, true);
}

/// <summary>
/// Rendering the Explain Result 
/// </summary>
function getExplainReturnMysql(p_data) {
    v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.selectExplainTabFunc();
    var v_div_explain = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.div_explain;

    // --- 1. 外部容器配置 ---
    if (v_div_explain) {
        v_div_explain.style.backgroundColor = "#ffffff";
        v_div_explain.style.height = "100%";        
        v_div_explain.style.minHeight = "";           
        v_div_explain.style.overflow = "hidden";    
        v_div_explain.style.display = "flex";        
        v_div_explain.style.flexDirection = "column"; 
    }

    // --- CSS 样式定义 (Local Scope) ---
    var styles = `
        /* 滚动视口 */
        .mysql-vex-scope .explain-wrapper { 
            background-color: #ffffff; 
            flex: 1;                   
            overflow: auto;           
            /* 使用 UI 字体，非等宽字体 */
            font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            font-size: 0.9em; 
            padding: 0px; 
            color: #000; 
            width: 100%; 
            box-sizing: border-box; 
            display: flex;
            flex-direction: column;
        }

        /* 每一行 */
        .mysql-vex-scope .explain-row { 
            display: flex; 
            line-height: 1.8; 
            background-color: transparent; 
            white-space: pre;        
            position: relative; 
            margin-bottom: 0px; 
            transition: background-color 0.1s; 
            width: 100%;              
            box-sizing: border-box;  
        }
        .mysql-vex-scope .explain-row:hover { outline: 1px solid #dbdbdb; z-index: 10; }
        
        /* 行号列：强制盒模型和宽度，确保与表头对齐 */
        .mysql-vex-scope .row-idx { 
            width: 2.5em; 
            min-width: 2.5em; 
            box-sizing: border-box;
            color: #000; 
            font-weight: normal; 
            text-align: right; 
            padding-right: 0.5em; 
            margin-right: 0.5em; 
            border-right: 1px solid transparent; 
            user-select: none; 
            z-index: 2; 
            flex-shrink: 0; 
        }

        .mysql-vex-scope .row-content { flex: 1; z-index: 2; padding-right: 10px; display: flex; align-items: center; } 
        
        .mysql-vex-scope .keyword-op { color: #000; font-weight: normal; } 
        .mysql-vex-scope .metric-info { color: #666; font-size: 0.9em; } 
        
        /* CTE 样式 */
        .mysql-vex-scope .cte-row { 
            font-weight: bold; 
            border-bottom: 1px dashed #fadbd8; 
            color: #e67e22 !important; 
        }
        .mysql-vex-scope .cte-row * {
            color: #e67e22 !important; 
        }
    `;

    var styleTag = document.createElement('style');
    styleTag.innerHTML = styles;

    if (p_data.v_error) {
        v_div_explain.innerHTML = '<div class="error_text">' + p_data.v_data.message + '</div>';
    } else {
        v_div_explain.innerHTML = '';
        v_div_explain.className = 'mysql-vex-scope';
        v_div_explain.appendChild(styleTag);

        var v_wrapper = document.createElement('div');
        v_wrapper.className = 'explain-wrapper';

        // Toolbar
        var v_toolbar = document.createElement('div');
        v_toolbar.className = 'vex-toolbar';
        v_toolbar.style.width = '100%';
        v_toolbar.innerHTML = `<div class="vex-action-btn" title="Text Format"><span class="glyphicon glyphicon-th-list"></span></div><div class="vex-action-btn" title="Visual Explain"><span class="glyphicon glyphicon-tree-deciduous"></span></div>`;
        v_toolbar.querySelectorAll('.vex-action-btn')[1].onclick = function () { if (window.vexRequestJSON) window.vexRequestJSON(); };
        v_wrapper.appendChild(v_toolbar);

        var v_plan_container = document.createElement('div');
        v_plan_container.style.cssText = "width: max-content; min-width: auto; display: flex; flex-direction: column; padding-right: 20px; box-sizing: border-box; margin: 0;";
        v_wrapper.appendChild(v_plan_container);

        var rows = p_data.v_data.v_data;

        // --- Header 配置 (关键对齐部分) ---
        var v_header = document.createElement('div');
        v_header.style.cssText = 'position:relative;display:flex;align-items:center;margin-bottom:5px;padding-bottom:5px;border-bottom:none;width:100%;box-sizing:border-box;';
        
        var v_sharp = document.createElement('div');
        // 这里必须完全模拟 .row-idx 的布局属性
        v_sharp.style.cssText = `
            width: 2.5em;
            min-width: 2.5em;
            box-sizing: border-box;
            text-align: right;
            padding-right: 0.5em;
            margin-right: 0.5em;
            flex-shrink: 0;
            font-weight: 900;
            color: #000;
        `;
        v_sharp.innerText = '#';
        
        var v_title = document.createElement('div');
        // 标题字体与列表保持一致，字号加大
        v_title.style.cssText = 'flex:1;text-align:center;font-weight:bold;font-size:1.2em;font-family:"Segoe UI", Roboto, Helvetica, Arial, sans-serif;';
        v_title.innerText = 'QUERY PLAN';
        
        v_header.appendChild(v_sharp);
        v_header.appendChild(v_title);
        
        v_plan_container.appendChild(v_header); 

        function getMetricValue(line) {
            var timeMatch = line.match(/actual time=[0-9\.]+\.\.([0-9\.]+)/);
            if (timeMatch && timeMatch[1]) {
                var loops = 1; var loopMatch = line.match(/loops=([0-9]+)/);
                if (loopMatch) loops = parseInt(loopMatch[1]);
                return parseFloat(timeMatch[1]) * loops;
            }
            var costM = line.match(/cost=[0-9\.]+\.\.([0-9\.]+)/) || line.match(/cost=([0-9\.]+)/);
            if (costM) return parseFloat(costM[1]);
            return 0;
        }

        var cleanRows = [];
        var maxMetricValue = 0;

        if (rows && rows.length > 0) {
            for (var k = 0; k < rows.length; k++) {
                var item = rows[k];
                var textBlock = Array.isArray(item) ? item[0] : item;
                if (typeof textBlock === 'string') {
                    var splitLines = textBlock.split(/\r?\n/);
                    for (var j = 0; j < splitLines.length; j++) {
                        var line = splitLines[j];
                        if (line.trim() !== "") {
                            var indent = line.search(/\S|$/);
                            var content = line.trim().replace(/^->\s?/, '');
                            var val = getMetricValue(line);
                            
                            var isCTE = false;
                            if (/^(Materialize\s+)?CTE\s+/i.test(content)) {
                                indent = 0; 
                                isCTE = true;
                            }

                            if (val > maxMetricValue) maxMetricValue = val;
                            cleanRows.push({ indent: indent, content: content, val: val, isCTE: isCTE });
                        }
                    }
                } else {
                    cleanRows.push({ indent: 0, content: String(textBlock), val: 0, isCTE: false });
                }
            }
        }

        if (cleanRows.length > 0) {
            function formatContent(text) {
                var keywords = ["Sort", "Limit", "Aggregate", "Gather", "Join", "Scan", "Seek", "Filter", "Table", "Index", "Hash", "Nested", "Loop", "Merge", "Materialize", "Group"];
                var regex = new RegExp("\\b(" + keywords.join("|") + ")\\b", "g");
                text = text.replace(regex, '<span class="keyword-op">$1</span>');
                text = text.replace(/(\(cost=.*?\))/g, '<span class="metric-info">$1</span>');
                text = text.replace(/(actual time=.*?)\s/g, '<span class="metric-info">$1 </span>');
                return text;
            }

            for (var i = 0; i < cleanRows.length; i++) {
                var rowObj = cleanRows[i];
                var nextRow = cleanRows[i + 1];
                var hasChildren = nextRow && (nextRow.indent > rowObj.indent);

                var v_rowDiv = document.createElement('div');
                v_rowDiv.className = 'explain-row';
                v_rowDiv.setAttribute('data-level', rowObj.indent);

                if (i === 0) {
                    v_rowDiv.style.backgroundColor = '#ffeaea';
                    v_rowDiv.style.fontWeight = 'bold';
                }

                if (!rowObj.isCTE && maxMetricValue > 0 && rowObj.val > 0) {
                    var ratio = rowObj.val / maxMetricValue;
                    var deepStop = ratio * 3;
                    if (deepStop < 0.5) deepStop = 0.5; if (deepStop > 3) deepStop = 3;
                    var lightStop = ratio * 50;
                    var deepColor = '#ff9090';
                    var lightColor = '#ffeaea';
                    var gradient = `linear-gradient(to right, ${deepColor} 0%, ${deepColor} ${deepStop}%, ${lightColor} ${deepStop}%, ${lightColor} ${lightStop}%, transparent ${lightStop}%)`;

                    if (i === 0) v_rowDiv.style.background = `${gradient}, #ffeaea`;
                    else v_rowDiv.style.background = gradient;
                }

                var v_idxSpan = document.createElement('div');
                v_idxSpan.className = 'row-idx';
                v_idxSpan.innerText = (i + 1);

                var v_contentSpan = document.createElement('div');
                v_contentSpan.className = 'row-content';
                // 缩进修正：使用 0.5em，避免层级过深时太宽
                v_contentSpan.style.paddingLeft = (rowObj.indent * 0.5) + 'em';

                if (rowObj.isCTE) {
                    v_rowDiv.classList.add('cte-row'); 
                    if (i > 0) {
                        v_rowDiv.style.marginTop = '15px'; 
                        v_rowDiv.style.borderTop = '1px solid #f0f0f0';
                        v_rowDiv.style.paddingTop = '5px';
                    }
                    v_contentSpan.innerHTML = rowObj.content; 
                } else {
                    var iconHtml = '';
                    if (hasChildren) {
                        iconHtml = `<span class="glyphicon glyphicon-circle-arrow-right vex-tree-arrow" onclick="window.vexToggleRow(this)"></span>`;
                    } else {
                        iconHtml = `<span class="vex-leaf-dot">•</span>`;
                    }
                    v_contentSpan.innerHTML = iconHtml + formatContent(rowObj.content);
                }

                v_rowDiv.appendChild(v_idxSpan);
                v_rowDiv.appendChild(v_contentSpan);
                v_plan_container.appendChild(v_rowDiv);
            }
        } else {
            v_plan_container.innerHTML += '<div>No plan returned.</div>';
        }

        v_div_explain.appendChild(v_wrapper);
    }

    refreshHeights();
}

// =========================================================
//  OmniDB MySQL Explain (Integrated: Universal Compact + Text View)
// =========================================================

(function() {
    
    // ---------------------------------------------------------
    // 1. 定义将在 Iframe 内部运行的脚本 (通用解析 + 紧凑绘图)
    // ---------------------------------------------------------
    function iframeScript() {
        
        // --- A. 通用解析引擎 (兼容 5.7/8.0 & 兜底未知节点) ---
        function normalizeMySQL(node) {
            if (!node) return null;
            if (typeof node !== 'object') return null;

            // 0. 解包
            if (node.query_block) return normalizeMySQL(node.query_block);

            // 初始化结果
            let result = { 
                "Node Type": "Unknown", 
                "Plans": [], 
                "Raw": node,
                "IsCTE": false,
                "Label": ""
            };
            
            let handled = false;

            // --- 1. 已知包装器 (Sort, Group 等) ---
            const wrappers = {
                "ordering_operation": "Sort",
                "grouping_operation": "Aggregate",
                "duplicates_removal": "Distinct",
                "windowing_operation": "Window Func"
            };
            
            for (let key in wrappers) {
                if (node[key]) {
                    result["Node Type"] = wrappers[key];
                    let child = normalizeMySQL(node[key]);
                    if (child) result.Plans.push(child);
                    handled = true;
                    break;
                }
            }

            // --- 2. Joins (Nested Loop, Hash Join) ---
            if (!handled) {
                if (node.nested_loop) {
                    result["Node Type"] = "Nested Loop";
                    node.nested_loop.forEach(c => {
                        let child = normalizeMySQL(c);
                        if(child) result.Plans.push(child);
                    });
                    handled = true;
                } else if (node.hash_join) {
                    result["Node Type"] = "Hash Join";
                    node.hash_join.forEach(c => {
                        let child = normalizeMySQL(c);
                        if(child) result.Plans.push(child);
                    });
                    handled = true;
                }
            }

            // --- 3. Table Scans (叶子节点) ---
            if (!handled && node.table) {
                let t = node.table;
                // 扫描类型检测
                let scanType = "Scan";
                if(t.access_type) {
                     scanType = t.access_type === 'ALL' ? "Seq Scan" : 
                                (t.access_type === 'ref' || t.access_type === 'eq_ref') ? "Index Scan" : 
                                (t.access_type === 'range') ? "Index Range Scan" : `Scan (${t.access_type})`;
                }
                
                // CTE 消费者检测
                let isCteConsumer = false;
                if (t.materialized_from_subquery) {
                    scanType = "CTE Scan";
                    isCteConsumer = true;
                }

                result["Node Type"] = scanType;
                result["Relation Name"] = t.table_name || "<derived>";
                result["Label"] = t.table_name ? `${scanType} on ${t.table_name}` : scanType;
                
                // Cost / Rows 信息 (兼容 5.7)
                let cost = 0;
                if(t.cost_info) {
                    cost = (parseFloat(t.cost_info.eval_cost||0) + parseFloat(t.cost_info.read_cost||0));
                }
                result["Total Cost"] = cost.toFixed(2);
                result["Plan Rows"] = t.rows_examined_per_scan || 0;

                // --> 分支 1: 物化 CTE 定义 (橙色线源头)
                if (isCteConsumer) {
                    let cteDef = normalizeMySQL(t.materialized_from_subquery);
                    if (cteDef) {
                        cteDef["IsCTE"] = true;
                        cteDef["Node Type"] = "Materialize CTE";
                        cteDef["Label"] = t.table_name ? `Materialize <${t.table_name}>` : "Materialize CTE";
                        result.Plans.push(cteDef);
                    }
                }
                
                // --> 分支 2: 关联子查询 (蓝色线源头)
                if (t.attached_subqueries) {
                    t.attached_subqueries.forEach(sq => {
                        let sqNode = normalizeMySQL(sq);
                        if(sqNode) {
                            sqNode["IsSubPlan"] = true; 
                            sqNode["Node Type"] = "SubPlan";
                            sqNode["Label"] = "Subquery";
                            result.Plans.push(sqNode);
                        }
                    });
                }

                handled = true;
            }

            // --- 4. 特殊情况: 独立物化 ---
            if (!handled && node.materialized_from_subquery) {
                 let cteDef = normalizeMySQL(node.materialized_from_subquery);
                 if (cteDef) return cteDef; 
            }

            // --- 5. 通用兜底 (Generic Fallback) ---
            // 如果节点类型未知，遍历所有 Key 寻找可能的子节点
            if (!handled) {
                result["Node Type"] = "Generic Node"; 
                
                Object.keys(node).forEach(key => {
                    // 跳过标量属性
                    if (['cost_info', 'rows_examined_per_scan', 'filtered', 'using_index', 'possible_keys', 'key', 'key_length'].indexOf(key) !== -1) return;
                    
                    if (typeof node[key] === 'object' && node[key] !== null) {
                        // 情况 A: 数组子节点
                        if (Array.isArray(node[key])) {
                            node[key].forEach(subNode => {
                                let child = normalizeMySQL(subNode);
                                if (child && (child.Plans.length > 0 || child["Node Type"] !== "Unknown")) {
                                    if (result["Node Type"] === "Generic Node") result["Node Type"] = key; 
                                    result.Plans.push(child);
                                }
                            });
                        } 
                        // 情况 B: 对象子节点
                        else {
                            let child = normalizeMySQL(node[key]);
                            if (child && (child.Plans.length > 0 || child["Node Type"] !== "Unknown")) {
                                if (result["Node Type"] === "Generic Node") result["Node Type"] = key;
                                result.Plans.push(child);
                            }
                        }
                    }
                });
            }

            // 清理空的 Generic 节点
            if (result["Node Type"] === "Generic Node" && result.Plans.length === 0) {
                 return null; 
            }

            return result;
        }

        // --- B. D3.js 绘图逻辑 (紧凑布局) ---
        window.renderGraph = function(jsonStr) {
            try {
                if (typeof d3 === 'undefined') { console.error("D3 missing"); return; }

                let rawData = JSON.parse(jsonStr);
                if(Array.isArray(rawData)) rawData = rawData[0];
                
                let rootData = normalizeMySQL(rawData);
                if (!rootData) throw new Error("Parser failed to normalize data structure.");

                const container = document.getElementById('vex-canvas-area');
                const width = container.clientWidth || 800; 
                const height = container.clientHeight || 600; 

                container.innerHTML = ''; 

                const svg = d3.select("#vex-canvas-area").append("svg")
                    .attr("width", "100%").attr("height", "100%")
                    .attr("viewBox", [0, 0, width, height])
                    .style("font-family", "'Segoe UI', Roboto, Helvetica, Arial, sans-serif")
                    .style("background-color", "#fff");
                
                // 定义箭头
                const defs = svg.append("defs");
                const arrowPath = "M0,-3L6,0L0,3"; 
                
                defs.append("marker").attr("id", "arrow-gray").attr("viewBox", "0 -3 6 6").attr("refX", 5).attr("refY", 0).attr("markerWidth", 4).attr("markerHeight", 4).attr("orient", "auto-start-reverse").append("path").attr("d", arrowPath).attr("fill", "#bbb");
                defs.append("marker").attr("id", "arrow-orange").attr("viewBox", "0 -3 6 6").attr("refX", 5).attr("refY", 0).attr("markerWidth", 4).attr("markerHeight", 4).attr("orient", "auto-start-reverse").append("path").attr("d", arrowPath).attr("fill", "#fb8c00");
                defs.append("marker").attr("id", "arrow-blue").attr("viewBox", "0 -3 6 6").attr("refX", 5).attr("refY", 0).attr("markerWidth", 4).attr("markerHeight", 4).attr("orient", "auto-start-reverse").append("path").attr("d", arrowPath).attr("fill", "#2196f3");

                const g = svg.append("g");
                const zoom = d3.zoom().scaleExtent([0.1, 4]).on("zoom", (e) => g.attr("transform", e.transform));
                svg.call(zoom);

                const root = d3.hierarchy(rootData, d => d.Plans);
                
                // *** 核心布局优化: [35, 200] 紧凑模式 ***
                const tree = d3.tree().nodeSize([35, 200]); 
                tree(root);

                const startX = 80;
                const startY = height / 2;

                const linkGen = d3.linkHorizontal()
                    .x(d => d.y + startX)
                    .y(d => d.x + startY);

                // 绘制连线
                g.selectAll(".vex-link")
                    .data(root.links())
                    .join("path")
                    .attr("class", "vex-link")
                    .attr("fill", "none")
                    .attr("stroke", d => {
                        if (d.target.data["IsCTE"]) return "#fb8c00"; 
                        if (d.target.data["IsSubPlan"]) return "#2196f3"; 
                        return "#bbb"; 
                    }) 
                    .attr("stroke-width", d => d.target.data["IsCTE"] ? "1.5px" : "1px")
                    .attr("stroke-dasharray", d => d.target.data["IsCTE"] || d.target.data["IsSubPlan"] ? "3, 2" : "none") 
                    .attr("marker-start", d => {
                        if (d.target.data["IsCTE"]) return "url(#arrow-orange)";
                        if (d.target.data["IsSubPlan"]) return "url(#arrow-blue)";
                        return "url(#arrow-gray)";
                    })
                    .attr("d", linkGen);

                // 绘制节点组
                const node = g.selectAll(".node")
                    .data(root.descendants())
                    .join("g")
                    .attr("class", "node")
                    .attr("cursor", "pointer")
                    .attr("transform", d => `translate(${d.y + startX},${d.x + startY})`);

                // 绘制圆点 (替代大卡片)
                node.append("circle")
                    .attr("r", 4.5) 
                    .attr("fill", d => {
                        if (d.data["IsCTE"]) return "#fff3e0"; 
                        if (d.data["IsSubPlan"]) return "#e3f2fd"; 
                        return "#e8f5e9"; 
                    })
                    .attr("stroke", d => {
                        if (d.data["IsCTE"]) return "#ef6c00"; 
                        if (d.data["IsSubPlan"]) return "#1565c0"; 
                        return "#43a047"; 
                    })
                    .attr("stroke-width", 1.5)
                    .on("mouseover", function(e, d) { d3.select(this).attr("r", 6).attr("stroke-width", 2); })
                    .on("mouseout", function(e, d) { d3.select(this).attr("r", 4.5).attr("stroke-width", 1.5); })
                    .on("click", function(e, d) {
                        e.stopPropagation();
                        showDetails(d);
                        d3.selectAll("circle").attr("stroke-width", 1.5);
                        d3.select(this).attr("stroke-width", 2.5).attr("stroke", "#2962ff");
                    });

                // 绘制标签
                node.each(function(d) {
                    const el = d3.select(this);
                    const isLeaf = !d.children || d.children.length === 0;
                    
                    const textLabel = el.append("text")
                        .attr("dy", isLeaf ? "3.5px" : "-8px") 
                        .attr("dx", isLeaf ? "10px" : "0px")
                        .attr("text-anchor", isLeaf ? "start" : "middle") 
                        .style("font-size", "10px")
                        .style("fill", "#333") 
                        .style("font-weight", isLeaf ? "normal" : "600") 
                        .style("pointer-events", "none") 
                        .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff");

                    let txt = d.data["Label"] || d.data["Node Type"];
                    if (!d.data["Label"] && d.data["Relation Name"]) {
                        txt += " " + d.data["Relation Name"];
                    }
                    
                    if (d.data["IsCTE"]) {
                        textLabel.style("fill", "#e65100").style("font-weight", "bold");
                    }
                    textLabel.text(txt);
                });

                // 详情面板
                function showDetails(d) {
                    let html = `<div style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid #eee;">
                                    <h3 style="margin:0;color:#2c3e50;font-size:12px;">${d.data["Node Type"]}</h3>
                                    ${d.data["Relation Name"] ? `<div style="color:#7f8c8d;font-size:11px;">${d.data["Relation Name"]}</div>` : ''}
                                </div>`;
                    let props = {}; 
                    if(d.data.Raw && d.data.Raw.table) Object.assign(props, d.data.Raw.table); 
                    else Object.assign(props, d.data.Raw || {});
                    
                    const ignore = ["nested_loop", "table", "query_block", "Plans", "hash_join", "materialized_from_subquery", "ordering_operation", "grouping_operation", "duplicates_removal", "windowing_operation", "attached_subqueries"];
                    ignore.forEach(k => delete props[k]);

                    html += '<div style="display:grid; grid-template-columns: auto 1fr; gap: 4px 10px;">';
                    for(let k in props) { 
                        if(typeof props[k] !== 'object') {
                            html += `<div style="color:#95a5a6;font-size:10px;text-align:right;">${k}:</div>`;
                            html += `<div style="color:#34495e;font-size:10px;font-family:consolas,monospace;">${props[k]}</div>`;
                        }
                    }
                    html += '</div>';
                    document.getElementById('vex-details-panel').innerHTML = html;
                }

                // 自动缩放
                setTimeout(() => { 
                    const bounds = g.node().getBBox(); 
                    if (bounds.width > 0) { 
                        const scale = 0.9 / Math.max(bounds.width / width, bounds.height / height);
                        const tX = width/2 - scale * (bounds.x + bounds.width/2);
                        const tY = height/2 - scale * (bounds.y + bounds.height/2);
                        svg.transition().duration(750)
                           .call(zoom.transform, d3.zoomIdentity.translate(tX, tY).scale(scale)); 
                    } 
                }, 100);

            } catch(e) { 
                console.error(e); 
                document.getElementById('vex-canvas-area').innerHTML = `<div style="color:red;padding:20px;">Error: ${e.message}</div>`;
            }
        };
    }

    // ---------------------------------------------------------
    // 2. 主窗口弹窗逻辑
    // ---------------------------------------------------------
    window.vexShowPopupGraph = function(jsonStr) {
        if(document.getElementById('vex-overlay')) document.getElementById('vex-overlay').remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'vex-overlay';
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px);";
        
        overlay.innerHTML = `
            <div id="vex-modal" style="width: 90%; height: 90%; background: #fff; border-radius: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; font-family: 'Segoe UI', sans-serif;">
                <div class="vex-modal-head" style="padding: 0 15px; height: 45px; background: #f8f9fa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-weight: 600; color: #444; font-size: 12px;">Graphical Explain</span>
                        <span style="background:#e8f5e9;color:#2e7d32;padding:2px 6px;border-radius:4px;font-size:10px;">Compact</span>
                    </div>
                    <button style="border:none;background:none;font-size:22px;color:#999;cursor:pointer;line-height:1;" onclick="document.getElementById('vex-overlay').remove()">×</button>
                </div>
                <div class="vex-modal-body" style="flex: 1; overflow: hidden; position: relative;"></div>
            </div>`;
        
        document.body.appendChild(overlay);
        overlay.onclick = (e)=>{ if(e.target===overlay) overlay.remove() };
        document.onkeydown = (e)=>{ if(e.keyCode == 27) overlay.remove() };

        const iframeContainer = overlay.querySelector('.vex-modal-body');
        const iframe = document.createElement('iframe');
        iframe.style.cssText = "width: 100%; height: 100%; border: none; display: block;";
        iframeContainer.appendChild(iframe);

        const scriptContent = iframeScript.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];

        const iframeDocContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
                <style>
                    body { margin: 0; padding: 0; height: 100vh; display: flex; overflow: hidden; font-family: 'Segoe UI', sans-serif; }
                    .vex-details { width: 260px; border-right: 1px solid #f0f0f0; padding: 15px; overflow-y: auto; background: #fafafa; font-size: 12px; z-index: 10; box-shadow: 2px 0 5px rgba(0,0,0,0.02); }
                    .vex-canvas { flex: 1; background-color: #fff; cursor: grab; }
                    .vex-canvas:active { cursor: grabbing; }
                    ::-webkit-scrollbar { width: 6px; height: 6px; }
                    ::-webkit-scrollbar-track { background: #f1f1f1; }
                    ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
                </style>
            </head>
            <body>
                <div class="vex-details" id="vex-details-panel">
                    <div style="color:#aaa; margin-top:40px; text-align:center; font-style:italic;">Select a node<br>to view details</div>
                </div>
                <div class="vex-canvas" id="vex-canvas-area"></div>
                <script>
                    ${scriptContent}
                    const checkD3 = setInterval(() => {
                        if (typeof d3 !== 'undefined') { clearInterval(checkD3); renderGraph(${JSON.stringify(jsonStr)}); }
                    }, 100);
                </script>
            </body>
            </html>
        `;

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(iframeDocContent);
        doc.close();
    };

})();

// =========================================================
// 3. 全局 Helper (Explain 文本模式 & 请求逻辑)
// =========================================================

// --- CSS for List View (Main Window) ---
(function(){
    const LIST_CSS = `
        .mysql-vex-scope .explain-wrapper { 
            background-color: #ffffff; 
            flex: 1; 
            overflow: auto; 
            /* 1. 改为 UI 字体 + 弹性单位 */
            font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 0.9em; 
            padding: 0px; 
            color: #000; 
            display: flex; 
            flex-direction: column; 
        }
    
        .mysql-vex-scope .explain-row { 
            display: flex; 
            /* 2. 行高保持相对比例 */
            line-height: 1.8; 
            white-space: pre; 
            position: relative; 
            margin-bottom: 0px; 
            width: 100%; 
            box-sizing: border-box; 
        }
    
        .mysql-vex-scope .explain-row:hover { outline: 1px solid #dbdbdb; z-index: 10; }
    
        /* 3. 强制对齐的行号样式 */
        .mysql-vex-scope .row-idx { 
            width: 2.5em; 
            min-width: 2.5em; 
            box-sizing: border-box; /* 关键 */
            color: #000; 
            text-align: right; 
            padding-right: 0.5em; 
            margin-right: 0.5em; 
            user-select: none; 
            flex-shrink: 0; 
            border-right: 1px solid transparent;
        }
    
        .mysql-vex-scope .row-content { 
            flex: 1; 
            padding-right: 10px; 
            display: flex; 
            align-items: center; 
            overflow: hidden; 
        } 
    
        .mysql-vex-scope .keyword-op { color: #000; font-weight: normal; } 
        .mysql-vex-scope .metric-info { color: #666; font-size: 0.9em; } 
        .mysql-vex-scope .cte-row { font-weight: bold; border-bottom: 1px dashed #fadbd8; color: #e67e22 !important; }
        
        /* 工具栏保持相对单位 */
        .mysql-vex-scope .vex-toolbar { display: inline-block; vertical-align: middle; padding-left: 0.5em; margin: 0.5em 0; }
        .mysql-vex-scope .vex-action-btn { width: 2em; height: 2em; display: inline-block; text-align: center; line-height: 2em; margin-right: 0.5em; cursor: pointer; color: #000; border-radius: 3px; }
        .mysql-vex-scope .vex-action-btn:hover { background-color: #eee; }
    
        /* 4. 树形结构的箭头和点也改为 em */
        .mysql-vex-scope .vex-tree-arrow { 
            cursor: pointer; 
            margin-right: 0.2em; 
            color: #000; 
            font-size: 1em; 
            width: 1.5em; 
            display: inline-block; 
            text-align: center; 
        }
        .mysql-vex-scope .vex-leaf-dot { 
            display: inline-block; 
            width: 1.5em; 
            text-align: center; 
            margin-right: 0.2em; 
            color: #ccc; 
            font-size: 1em; 
        }
    `;
    var existingStyle = document.getElementById('vex-list-style');
    if (existingStyle) existingStyle.remove();
    var s = document.createElement('style');
    s.id = 'vex-list-style';
    s.innerHTML = LIST_CSS;
    document.head.appendChild(s);
})();

// =========================================================
// 3. Main Logic
// =========================================================

window.getExplainMysql = function(p_mode) {
    var v_editor = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor;
    var v_query = v_editor.getSelectedText();
    if (v_query.trim() == '') v_query = v_editor.getValue();
    if (v_query.trim() == '') { showAlert('Please provide a string.'); return; }

    if (p_mode == 0) v_query = 'EXPLAIN FORMAT=TREE ' + v_query; 
    else if (p_mode == 1) v_query = 'EXPLAIN ANALYZE ' + v_query; 

    querySQL(0, true, v_query, getExplainReturnMysql, true);
};

window.getExplainReturnMysql = function(p_data) {
    v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.selectExplainTabFunc();
    var v_div_explain = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.div_explain;

    if (v_div_explain) {
        v_div_explain.style.backgroundColor = "#ffffff";
        v_div_explain.style.height = "100%";        
        v_div_explain.style.minHeight = "";           
        v_div_explain.style.overflow = "hidden";    
        v_div_explain.style.display = "flex";        
        v_div_explain.style.flexDirection = "column"; 
    }

    if (p_data.v_error) {
        v_div_explain.innerHTML = '<div class="error_text">' + p_data.v_data.message + '</div>';
    } else {
        v_div_explain.innerHTML = '';
        v_div_explain.className = 'mysql-vex-scope';
        var v_wrapper = document.createElement('div');
        v_wrapper.className = 'explain-wrapper';

        // Toolbar
        var v_toolbar = document.createElement('div');
        v_toolbar.className = 'vex-toolbar';
        v_toolbar.style.width = '100%';
        v_toolbar.innerHTML = `<div class="vex-action-btn" title="Text Format"><span class="glyphicon glyphicon-th-list"></span></div><div class="vex-action-btn" title="Visual Explain"><span class="glyphicon glyphicon-tree-deciduous"></span></div>`;
        v_toolbar.querySelectorAll('.vex-action-btn')[1].onclick = function () { 
            if (window.vexRequestJSON) { window.vexRequestJSON(); }
        };
        v_wrapper.appendChild(v_toolbar);

        var v_plan_container = document.createElement('div');
        v_plan_container.style.cssText = "width: max-content; min-width: auto; display: flex; flex-direction: column; padding-right: 20px; box-sizing: border-box; margin: 0;";
        v_wrapper.appendChild(v_plan_container);

        var rows = p_data.v_data.v_data;
        // Header
        var v_header = document.createElement('div'); v_header.style.cssText = 'position:relative;display:flex;align-items:center;margin-bottom:5px;padding-bottom:5px;border-bottom:none;width:100%; box-sizing: border-box;';
        
        var v_sharp = document.createElement('div');
        // 确保 # 号与行号完全对齐
        v_sharp.style.cssText = `
            width: 2.5em;
            min-width: 2.5em;
            box-sizing: border-box;
            text-align: right;
            padding-right: 0.5em;
            margin-right: 0.5em;
            flex-shrink: 0;
            font-weight: 900;
            color: #000;
        `;
        v_sharp.innerText = '#';
        
        var v_title = document.createElement('div'); 
        v_title.style.cssText = 'flex:1;text-align:center;font-weight:bold;font-size:1.2em;font-family:"Segoe UI", Roboto, Helvetica, Arial, sans-serif;'; 
        v_title.innerText = 'QUERY PLAN';
        
        v_header.appendChild(v_sharp); v_header.appendChild(v_title); v_plan_container.appendChild(v_header); 

        function getMetricValue(line) {
            var timeMatch = line.match(/actual time=[0-9\.]+\.\.([0-9\.]+)/);
            if (timeMatch && timeMatch[1]) {
                var loops = 1; var loopMatch = line.match(/loops=([0-9]+)/);
                if (loopMatch) loops = parseInt(loopMatch[1]);
                return parseFloat(timeMatch[1]) * loops;
            }
            var costM = line.match(/cost=[0-9\.]+\.\.([0-9\.]+)/) || line.match(/cost=([0-9\.]+)/);
            if (costM) return parseFloat(costM[1]);
            return 0;
        }

        var cleanRows = []; var maxMetricValue = 0;
        if (rows && rows.length > 0) {
            for (var k = 0; k < rows.length; k++) {
                var item = rows[k]; var textBlock = Array.isArray(item) ? item[0] : item;
                if (typeof textBlock === 'string') {
                    var splitLines = textBlock.split(/\r?\n/);
                    for (var j = 0; j < splitLines.length; j++) {
                        var line = splitLines[j];
                        if (line.trim() !== "") {
                            var indent = line.search(/\S|$/); var content = line.trim().replace(/^->\s?/, ''); var val = getMetricValue(line);
                            var isCTE = false; if (/^(Materialize\s+)?CTE\s+/i.test(content)) { indent = 0; isCTE = true; }
                            if (val > maxMetricValue) maxMetricValue = val;
                            cleanRows.push({ indent: indent, content: content, val: val, isCTE: isCTE });
                        }
                    }
                } else { cleanRows.push({ indent: 0, content: String(textBlock), val: 0, isCTE: false }); }
            }
        }

        if (cleanRows.length > 0) {
            function formatContent(text) {
                var keywords = ["Sort", "Limit", "Aggregate", "Gather", "Join", "Scan", "Seek", "Filter", "Table", "Index", "Hash", "Nested", "Loop", "Merge", "Materialize", "Group"];
                var regex = new RegExp("\\b(" + keywords.join("|") + ")\\b", "g");
                text = text.replace(regex, '<span class="keyword-op">$1</span>');
                text = text.replace(/(\(cost=.*?\))/g, '<span class="metric-info">$1</span>');
                text = text.replace(/(actual time=.*?)\s/g, '<span class="metric-info">$1 </span>');
                return text;
            }
            for (var i = 0; i < cleanRows.length; i++) {
                var rowObj = cleanRows[i]; var nextRow = cleanRows[i + 1]; var hasChildren = nextRow && (nextRow.indent > rowObj.indent);
                
                var v_rowDiv = document.createElement('div'); 
                v_rowDiv.className = 'explain-row'; 
                v_rowDiv.setAttribute('data-level', rowObj.indent);
                
                if (i === 0) { v_rowDiv.style.backgroundColor = '#ffeaea'; v_rowDiv.style.fontWeight = 'bold'; }
                
                // 渐变色
                if (!rowObj.isCTE && maxMetricValue > 0 && rowObj.val > 0) {
                    var ratio = rowObj.val / maxMetricValue; var deepStop = ratio * 3; if (deepStop < 0.5) deepStop = 0.5; if (deepStop > 3) deepStop = 3; var lightStop = ratio * 50;
                    var deepColor = '#ff9090'; var lightColor = '#ffeaea'; var gradient = `linear-gradient(to right, ${deepColor} 0%, ${deepColor} ${deepStop}%, ${lightColor} ${deepStop}%, ${lightColor} ${lightStop}%, transparent ${lightStop}%)`;
                    if (i === 0) v_rowDiv.style.background = `${gradient}, #ffeaea`; else v_rowDiv.style.background = gradient;
                }
                
                var v_idxSpan = document.createElement('div'); 
                v_idxSpan.className = 'row-idx'; 
                v_idxSpan.innerText = (i + 1);
                
                var v_contentSpan = document.createElement('div'); 
                v_contentSpan.className = 'row-content'; 
                // 缩进优化：0.5em
                v_contentSpan.style.paddingLeft = (rowObj.indent * 0.5) + 'em';
                
                // CTE 特殊处理
                if (rowObj.isCTE) { 
                    v_rowDiv.classList.add('cte-row');
                    
                    if (i > 0) { 
                        v_rowDiv.style.marginTop = '15px'; 
                        v_rowDiv.style.borderTop = '1px solid #f0f0f0'; 
                        v_rowDiv.style.paddingTop = '5px'; 
                    } 
                    v_contentSpan.innerHTML = rowObj.content; 
                } else { 
                    var iconHtml = hasChildren ? `<span class="glyphicon glyphicon-circle-arrow-right vex-tree-arrow" onclick="window.vexToggleRow(this)"></span>` : `<span class="vex-leaf-dot">•</span>`; 
                    v_contentSpan.innerHTML = iconHtml + formatContent(rowObj.content); 
                }
                
                v_rowDiv.appendChild(v_idxSpan); v_rowDiv.appendChild(v_contentSpan); v_plan_container.appendChild(v_rowDiv);
            }
        } else { v_plan_container.innerHTML += '<div>No plan returned.</div>'; }
        v_div_explain.appendChild(v_wrapper);
    }
    refreshHeights();
};

window.vexRequestJSON = function() {
    var v_editor = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor;
    var v_query = v_editor.getSelectedText();
    if (v_query.trim() == '') v_query = v_editor.getValue();
    if (v_query.trim() == '') return;
    var jsonQuery = 'EXPLAIN FORMAT=JSON ' + v_query.replace(/^explain\s+(format=tree\s+|analyze\s+)?/i, '');
    
    querySQL(0, true, jsonQuery, function(p_data) {
        if(!p_data.v_error) {
            var rows = p_data.v_data.v_data;
            var jsonStr = Array.isArray(rows) ? rows.map(r => Array.isArray(r) ? r[0] : r).join("") : "";
            if (jsonStr.indexOf('{') > -1) jsonStr = jsonStr.substring(jsonStr.indexOf('{'));
            if(jsonStr.lastIndexOf('}') > -1) jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);
            
            // 调用新的 Iframe 弹窗函数
            window.vexShowPopupGraph(jsonStr);
        } else {
            alert("Explain Error:\n" + p_data.v_data.message);
        }
    }, true);
};

window.vexToggleRow = function(icon) {
    var row = icon.closest('.explain-row');
    var currentLevel = parseInt(row.getAttribute('data-level'));
    var isExpanded = icon.classList.contains('glyphicon-circle-arrow-right');
    
    if (isExpanded) {
        icon.classList.remove('glyphicon-circle-arrow-right'); icon.classList.add('glyphicon-circle-arrow-up');
    } else {
        icon.classList.remove('glyphicon-circle-arrow-up'); icon.classList.add('glyphicon-circle-arrow-right');
    }

    var nextRow = row.nextElementSibling;
    while (nextRow) {
        if (!nextRow.classList.contains('explain-row')) break;
        var nextLevel = parseInt(nextRow.getAttribute('data-level'));
        if (isNaN(nextLevel) || nextLevel <= currentLevel) break;
        nextRow.style.display = isExpanded ? 'none' : 'flex';
        nextRow = nextRow.nextElementSibling;
    }
};

// ---------------------------------------------------------
// 4. 按钮注入
// ---------------------------------------------------------
setInterval(function() {
    try {
        if (typeof v_connTabControl === 'undefined' || !v_connTabControl.selectedTab) return;
        var connTag = v_connTabControl.selectedTab.tag;
        if (!connTag || !connTag.selectedDBMS || String(connTag.selectedDBMS).toLowerCase().indexOf('mysql') === -1) return;
        var tab = connTag.tabControl.selectedTab;
        if (!tab) return;
        if (document.getElementById('bt_mysql_explain_' + tab.id)) return;
        var targetBtn = document.getElementById('bt_history_' + tab.id) || document.getElementById('bt_start_' + tab.id);
        if (!targetBtn) return;
        
        var btnExplain = document.createElement('button');
        btnExplain.id = 'bt_mysql_explain_' + tab.id;
        btnExplain.className = 'dbms_object bt_icon_only'; 
        btnExplain.style.cssText = 'display: inline-block; margin-left: 5px;';
        btnExplain.title = 'Explain';
        btnExplain.innerHTML = '<i class="fas fa-search fa-light"></i>';
        btnExplain.onclick = function() { getExplainMysql(0); };
        
        var btnAnalyze = document.createElement('button');
        btnAnalyze.id = 'bt_mysql_analyze_' + tab.id;
        btnAnalyze.className = 'dbms_object bt_icon_only';
        btnAnalyze.style.cssText = 'display: inline-block; margin-left: 5px;';
        btnAnalyze.title = 'Explain Analyze';
        btnAnalyze.innerHTML = '<i class="fas fa-search-plus fa-light"></i>';
        btnAnalyze.onclick = function() { getExplainMysql(1); };
        
        if (targetBtn.nextSibling) {
            targetBtn.parentNode.insertBefore(btnExplain, targetBtn.nextSibling);
            targetBtn.parentNode.insertBefore(btnAnalyze, btnExplain.nextSibling);
        } else {
            targetBtn.parentNode.appendChild(btnExplain);
            targetBtn.parentNode.appendChild(btnAnalyze);
        }
    } catch (e) { console.error(e); }
}, 1000);