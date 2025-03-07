#!/usr/bin/python3
# coding=utf-8

#   Copyright 2022 getcarrier.io
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

""" Module """
from pylon.core.tools import log  # pylint: disable=E0401
from pylon.core.tools import module  # pylint: disable=E0401

from tools import theme, VaultClient  # pylint: disable=E0401
import hvac


class Module(module.ModuleModel):
    """ Pylon module """

    def __init__(self, context, descriptor):
        self.context = context
        self.descriptor = descriptor
        #
        # self.db = Holder()  # pylint: disable=C0103
        # self.db.tbl = Holder()

    def init(self):
        """ Init module """
        log.info("Initializing module")
        # Run DB migrations
        # db_migrations.run_db_migrations(self, db.url)
        # DB
        # Theme registration
        #
        # System: for landing info screen
        #
        theme.register_section(
            "system", "System",
            kind="holder",
            hidden=True,
            location="left",
            permissions=[],
            # icon_class="fas fa-info-circle fa-fw",
        )
        theme.register_subsection(
            "system",
            "status", "Status",
            title="Status",
            kind="slot",
            hidden=True,
            permissions=[],
            prefix="admin_system_status_",
            # icon_class="fas fa-server fa-fw",
            # weight=2,
        )
        theme.register_page(
            "system", "status", "empty",
            title="Empty",
            kind="slot",
            permissions=[],
            prefix="admin_system_status_empty_",
        )
        #
        # Administration mode
        #
        theme.register_mode(
            "administration", "Administration",
        )
        theme.register_mode_section(
            "administration", "projects", "Projects",
            kind="holder",
            location="left",
            permissions=["projects"],
            # icon_class="fas fa-info-circle fa-fw",
        )
        theme.register_mode_subsection(
            "administration", "projects",
            "list", "Projects",
            title="Projects",
            kind="slot",
            permissions=["projects.projects"],
            prefix="admin_mode_projects_",
            # icon_class="fas fa-server fa-fw",
            # weight=2,
        )
        theme.register_mode_subsection(
            "administration", "configuration",
            "roles", "Roles",
            title="Roles",
            kind="slot",
            permissions=["configuration.roles"],
            prefix="admin_mode_roles_",
            # icon_class="fas fa-server fa-fw",
            # weight=2,
        )
        theme.register_subsection(
            "configuration",
            "roles", "Roles",
            title="Roles",
            kind="slot",
            permissions=["configuration.roles"],
            prefix="roles_",
        )
        theme.register_subsection(
            "configuration",
            "users", "Users",
            title="Users",
            kind="slot",
            permissions=["configuration.users"],
            prefix="users_",
        )
        theme.register_mode_page(
            "administration", "projects",
            "list", "edit",
            title="Edit",
            kind="slot",
            permissions=["projects.projects"],
            prefix="admin_mode_projects_edit_",
        )

        theme.register_mode_section(
            "administration", "configuration", "Configuration",
            kind="holder",
            location="left",
            permissions=["configuration"],
            # icon_class="fas fa-info-circle fa-fw",
        )
        # Init
        self.descriptor.init_all()

        vc = VaultClient()
        try:
            vc.init_project_space()
        except hvac.exceptions.InvalidRequest:
            ...

    def deinit(self):  # pylint: disable=R0201
        """ De-init module """
        log.info("De-initializing module")
        # De-init
        # self.descriptor.deinit_all()
