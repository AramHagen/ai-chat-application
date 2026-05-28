import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../types/chat.types';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full'
  }
})
export class Sidebar {
  conversations = signal<Conversation[]>([
    { id: '1', title: 'Create Html! Game Environment...', timestamp: new Date() },
    { id: '2', title: 'Apply To Leave For Emergency', timestamp: new Date(Date.now() - 86400000) },
    { id: '3', title: 'What Is UI UX Design?', timestamp: new Date(Date.now() - 172800000) },
    { id: '4', title: 'Create POS System', timestamp: new Date(Date.now() - 259200000) },
    { id: '5', title: 'What Is UX Audit?', timestamp: new Date(Date.now() - 345600000) },
  ]);

  lastSevenDays = signal<Conversation[]>([
    { id: '6', title: 'Create Chatbot GPT...', timestamp: new Date(Date.now() - 432000000) },
    { id: '7', title: 'How Chat GPT Work?', timestamp: new Date(Date.now() - 518400000) },
  ]);

  olderConversations = signal<Conversation[]>([
    { id: '8', title: 'Crypto Lending App Name', timestamp: new Date(Date.now() - 604800000) },
    { id: '9', title: 'Operator Grammar Types', timestamp: new Date(Date.now() - 691200000) },
  ]);

  onNewChat() {
    console.log('New chat clicked');
  }

  onClearAll() {
    console.log('Clear all clicked');
  }

  onSelectConversation(conversation: Conversation) {
    console.log('Selected conversation:', conversation);
  }

  onDeleteConversation(event: Event, conversationId: string) {
    event.stopPropagation();
    console.log('Delete conversation:', conversationId);
    // Will integrate with API later
  }

  onSettings() {
    console.log('Settings clicked');
  }
}
