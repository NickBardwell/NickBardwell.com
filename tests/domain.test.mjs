import test from 'node:test';
import assert from 'node:assert/strict';
import {clubs,sortClubs,categories} from '../lib/clubs.ts';
import {validTransition,validLsuaEmail,safeJoinUrl} from '../lib/workflow.ts';
test('directory includes all 44 supplied entries without invented totals',()=>{assert.equal(clubs.length,44);assert.equal(new Set(clubs.map(c=>c.id)).size,44);assert.ok(clubs.every(c=>c.members===null));assert.ok(clubs.every(c=>categories.includes(c.category)));});
test('alphabetical directory ignores membership values',()=>{const sorted=sortClubs([{...clubs[0],name:'Zebra',members:1000},{...clubs[1],name:'Apple',members:null}],'name');assert.equal(sorted[0].name,'Apple');});
test('review and applicant transitions protect confirmed outcomes',()=>{assert.equal(validTransition('submitted','approved',false),false);assert.equal(validTransition('submitted','approved',true),true);assert.equal(validTransition('approved','in_review',true),false);assert.equal(validTransition('needs_info','in_review',false),true);assert.equal(validTransition('in_review','withdrawn',false),true);});
test('email domain matching excludes lookalike domains',()=>{assert.equal(validLsuaEmail('student@LSUA.EDU'),true);for(const value of ['a@lsua.edu.fake.com','a@gmail.com','a@evil-lsua.edu','a @lsua.edu'])assert.equal(validLsuaEmail(value),false);});
test('self-join redirects stay on LSUA or its Involve directory',()=>{assert.equal(safeJoinUrl('https://lsua.presence.io/organization/test'),true);for(const value of ['javascript:alert(1)','https://lsua.edu.evil.com/','https://evil.com','https://student@lsua.edu/','http://lsua.edu'])assert.equal(safeJoinUrl(value),false);});
