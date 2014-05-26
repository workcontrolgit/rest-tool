#!/usr/bin/env node
/*jshint node: true */
'use strict';

var mu = require('mu2'),
    fs = require('fs'),
    generator = require('rest-tool-common').generator,
    extend = require('rest-tool-common').extend;
var verbose = false;

var capitalizeFirstLetter = function(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var extendConfig = function(serviceConfig) {
    var cName = capitalizeFirstLetter( serviceConfig.name );
    serviceConfig.cName = cName;

    return serviceConfig;
};

/**
 * Add a new service descriptor to the project
 * @param  {Object} serviceConfig   Configuration parameters of the new service
 * @param  {Object} projectConfig   Configuration parameters of the project
 * @param  {bool} verbose           Work in verbose mode if `true`
 * @return {bool}                   `true` if succesfully executed, `false` otherwise
 */
exports.add = function( serviceConfig, projectConfig, mode ) {
    verbose = mode;
    var path = require('path'),
        pathSep = path.sep,
        view = {};

    var servicePath = projectConfig.servicesRoot + pathSep + serviceConfig.path;

    console.log('Create the "%s/%s" %s-type service with the following URL: %s',
        process.cwd(), servicePath, serviceConfig.type, serviceConfig.uriTemplate);

    if ( generator.createDirectoryTree(servicePath, [], false) ) {
        console.log('%s directory created', servicePath );
        extend(view, extendConfig(serviceConfig));
        var templates = [];
        if (serviceConfig.type === 'OPERATION') {
            templates = [
                "service.yml",
                "postOperation-requestBody.json",
                "postOperation-responseBody.json"
            ];
        } else if (serviceConfig.type === 'COLLECTION') {
            templates = [
                "service.yml",
                "getCollection-responseBody.json",
                "postCollection-requestBody.json",
                "postCollection-responseBody.json"
            ];
        } else if (serviceConfig.type === 'RESOURCE') {
            templates = [
                "service.yml",
                "getResource-responseBody.json",
                "putResource-requestBody.json",
                "putResource-responseBody.json",
                "deleteResource-responseBody.json"
            ];
        }

        templates.forEach(function(template) {
            generator.processTemplate(view, {
                sourceBaseDir: path.join(process.cwd(), 'templates', 'services', serviceConfig.type),
                targetBaseDir: servicePath,
                template: template
            });
        });
    }
};

exports.bulkAdd = function( bulkServices, projectConfig, mode ) {
    var serviceConfig;
    // console.log('bulk-add ', bulk);
    bulkServices.forEach(function(service) {
        exports.add({
            type: service.type,
            path: service.path,
            name: service.name,
            uriTemplate: service.uriTemplate,
            description: service.description
        },
        projectConfig, 
        mode);
    });
};
