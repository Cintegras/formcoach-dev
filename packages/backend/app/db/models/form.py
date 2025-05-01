from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Form(Base):
    """
    Form model
    
    Represents a form in the database
    """
    __tablename__ = "forms"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    settings = Column(JSON, nullable=True)
    
    # Relationships
    fields = relationship("FormField", back_populates="form", cascade="all, delete-orphan")
    submissions = relationship("FormSubmission", back_populates="form", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Form(id={self.id}, title={self.title})>"


class FormField(Base):
    """
    Form field model
    
    Represents a field in a form
    """
    __tablename__ = "form_fields"
    
    id = Column(String, primary_key=True, index=True)
    form_id = Column(String, ForeignKey("forms.id"), nullable=False)
    type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    placeholder = Column(String, nullable=True)
    required = Column(Boolean, default=False)
    options = Column(JSON, nullable=True)
    validation = Column(JSON, nullable=True)
    default_value = Column(String, nullable=True)
    help_text = Column(String, nullable=True)
    disabled = Column(Boolean, default=False)
    class_name = Column(String, nullable=True)
    
    # Relationships
    form = relationship("Form", back_populates="fields")
    
    def __repr__(self):
        return f"<FormField(id={self.id}, type={self.type}, label={self.label})>"


class FormSubmission(Base):
    """
    Form submission model
    
    Represents a submission of a form
    """
    __tablename__ = "form_submissions"
    
    id = Column(String, primary_key=True, index=True)
    form_id = Column(String, ForeignKey("forms.id"), nullable=False)
    submitted_at = Column(DateTime, nullable=False)
    submitted_by = Column(String, nullable=True)
    values = Column(JSON, nullable=False)
    
    # Relationships
    form = relationship("Form", back_populates="submissions")
    
    def __repr__(self):
        return f"<FormSubmission(id={self.id}, form_id={self.form_id})>"